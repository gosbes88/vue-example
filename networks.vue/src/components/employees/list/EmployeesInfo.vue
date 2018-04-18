<template>
    <div class="page-list-employees__content js-js">

        <filter-block @updateFilters="updateFilter" :width-column="widthColumn"></filter-block>

        <div class="list-employees-table-wrap" ref="tableWrap" :style="{'min-width' : widthColumn + 'px'}">
            <div class="list-employees-table-wrap__scroll list-employees-table-wrap__scroll--bottom" :class="{'list-employees-table-wrap__scroll--bottom': false}" ref="scroll">
                <div ref="content">
                    <div v-show="showTable">
                        <table class="list-employees-table js-list-employees-table">
                            <thead>
                                <tr>
                                    <th class="list-employees-table__title">
                                        <div class="list-employees-table__checkbox checkbox-wrap">
                                            <input type="checkbox" class="checkbox" id="checkbox" v-model="allSelected"/>
                                            <label for="checkbox">
                                                <span class="check" :style="{background: 'url(' + CheckImg + ') no-repeat'}"></span>
                                            </label>
                                        </div>
                                    </th>
                                    <th is="tableHeadCell" :indicator="{}" :index="0" @changeOffset="changeOffset"></th>
                                    <th is="tableHeadCell" v-for="(indicator, index) in getFilterCompetencies"
                                        :key="index"
                                        :indicator="indicator"
                                        :index="index + 1"
                                        @changeOffset="changeOffset"
                                    ></th>
                                </tr>
                            </thead>

                            <tbody v-if="getEmployees.length">
                                <employee v-for="(emp, index) in getEmployees"
                                          :key="index"
                                          :employee-statistics="emp"
                                          :competencies="getFilterCompetencies"
                                          :selected="selectedEmployees"
                                          @selectEmployee="selectEmployee"
                                >
                                </employee>
                            </tbody>
                            <tbody v-else-if="showEmpty">
                                <tr>
                                    <td :class="emptyContent" colspan="6" v-lang.employees.emptyContent></td>
                                </tr>
                            </tbody>
                        </table>
                        <infinite-loading :style="{width: widthColumn + 'px'}" @infinite="loadEmployees" ref="infiniteLoading">
                            <span slot="no-more"></span>
                            <span slot="no-results"></span>
                            <span slot="spinner"></span>
                        </infinite-loading>

                        <analysis-panel :show-border="showBorder"
                                        :width-column="widthColumn"
                                        :show-panel="Boolean(getEmployees.length || selectedEmployees.length > 1)"
                                        :selected-employees-length="selectedEmployees.length"
                                        :all-selected="allSelected"
                                        :key="1"
                                        :class="{'fixed': showBorder}"
                        ></analysis-panel>
                    </div>

                    <div v-show="!showTable" class="list-employees-table load">
                        <span class="loading-icon-employees rotating"></span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import BriefCaseImg from '../../../assets/img/employees/briefcase.svg';
    import CheckImg from '../../../assets/img/employees/check.svg';
    import MultipleUsersImg from '../../../assets/img/multiple-users.svg';
    import CheckedImg from '../../../assets/img/checked.svg';
    import AnalysisImg from '../../../assets/img/analysis.svg';
    import LoadingImg from '../../../assets/img/employees/loading.svg';
    import mixins from '../../../mixins/utils';
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
    import { EMPLOYEES_LIMIT, fillFormData, FORM_HEADERS } from '../../../utils/Constants';

    export default {
        props: {
            showEmpty: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                BriefCaseImg,
                CheckImg,
                MultipleUsersImg,
                CheckedImg,
                AnalysisImg,
                LoadingImg,
                widthColumn: 0,
                minWidthPage: 0,
                selectedEmployees: [],
                allSelected: false,
                offset: 0,
                timer: null,
                showBorder: false,
                filters: {
                    position: null,
                    departmentId: null,
                    filter: ""
                },
                showTable: true
            }
        },
        mixins: [ mixins ],
        components: {
            Employee: () => import('./Employee.vue'),
            FilterBlock: () => import('./FilterBlock.vue'),
            TableHeadCell: () => import('./TableHeadCell.vue'),
            InfiniteLoading: () => import('vue-infinite-loading'),
            AnalysisPanel: () => import('./AnalysisPanel.vue')
        },
        watch: {
            allSelected(val) {
                this.selectedEmployees = val ? this.getEmployees.map(e => e.employee.id) : [];
            },
            employeesRatings(val) {
                this.scrollPage();
            }
        },
        methods: {
            setShowTable(value) {
                this.showTable = value;
            },
            setMinWidthPage() {
                this.widthColumn = document.querySelector(".js-list-employees-table").offsetWidth;
                this.minWidthPage = document.querySelector(".page-list-employees__aside")
                        ? document.querySelector(".page-list-employees__aside").offsetWidth
                        : 0;
                document.querySelector(".header-wrap").style.minWidth = this.calcPageTotalWidth() + 'px';
                this.$emit("updateWidth", !(this.calcPageTotalWidth() > window.innerWidth));
            },
            calcPageTotalWidth() {
                let paddingContentTotal = window.getComputedStyle(document.querySelector(".page-list-employees__content"));
                let computedContentPadLeft = parseFloat(paddingContentTotal.paddingLeft);
                let computedContentPadRight = parseFloat(paddingContentTotal.paddingRight);
                let widthScrollBar = 6;
                return this.widthColumn + this.minWidthPage + computedContentPadLeft + computedContentPadRight + widthScrollBar;
            },
            changeOffset() {
                this.offset = 0;
                this.changeFilter();
                this.$refs.scroll.scrollTop = 0;
            },
            loadEmployees($state) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.updateCurrentFilter({field: 'offset', value: this.offset});
                    this.updateCurrentFilter({field: 'limit', value: EMPLOYEES_LIMIT});
                    this.$http.post('/networks/service/rest/m/employees/ratings', fillFormData(this.currentFilter.orElse({})), FORM_HEADERS)
                        .then(response => {
                            if (!response.body.ratings.length) {
                                $state.complete();
                            } else {
                                $state.loaded();
                                const ids = response.body.ratings.map(r => r.employee.id);
                                let availableEmployees = this.getEmployees.filter(e => !ids.includes(e.employee.id));
                                this.fillRatings({values: availableEmployees.concat(response.body.ratings)});
                                this.offset += EMPLOYEES_LIMIT;
                                if (this.allSelected) {
                                    this.selectedEmployees = this.getEmployees.map(e => e.employee.id);
                                }
                            }
                        })
                        .catch(error => console.error(error));
                }, 300);
            },
            changeFilter() {
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            selectEmployee(id) {
                if (this.allSelected) {
                    this.allSelected = false;
                    setTimeout(() => this.selectedEmployees = [id], 0);
                } else {
                    !this.selectedEmployees.includes(id)
                        ? this.selectedEmployees.push(id)
                        : this.selectedEmployees.splice(this.selectedEmployees.indexOf(id), 1);
                }
            },
            async updateFilter(filters) {
                this.filters = filters;
                this.offset = 0;
                Object.keys(this.filters).map(k => this.updateCurrentFilter({field: k, value: this.filters[k]}));
                this.changeFilter();
                await this.getEmployeesRatings(this.currentFilter.orElse({}));
                if (this.allSelected) {
                    this.selectedEmployees = this.getEmployees.map(e => e.employee.id);
                }
            },
            scrollPage(event) {
                if (this.$refs.content.offsetHeight > this.$refs.tableWrap.offsetHeight && (this.$refs.scroll.scrollTop + this.$refs.tableWrap.offsetHeight < this.$refs.content.offsetHeight)) {
                    this.showBorder = true;
                } else if ((this.$refs.scroll.scrollTop + this.$refs.tableWrap.offsetHeight >= this.$refs.content.offsetHeight) && event && event.deltaY < 0) {
                    this.showBorder = true;
                } else {
                    this.showBorder = this.getEmployeesTotalCount > 0 && this.getEmployeesTotalCount > this.getEmployees.length;
                }
            },
            updateRatings() {
                this.offset = 0;
                this.$refs.scroll.scrollTop = 0;
                this.changeFilter();
                this.getEmployeesRatings(this.currentFilter.orElse({}));
            },
            ...mapMutations('employees', [
                'updateCurrentFilter',
                'fillRatings'
            ]),
            ...mapActions('employees', [
                'getEmployeesRatings'
            ])
        },
        computed: {
            emptyContent() {
                return {
                    'list-employees-table__empty': !this.selectedEmployees.length,
                    'list-employees-table__empty-big': this.selectedEmployees.length
                };
            },
            getFilterCompetencies() {
                return this.getIndicators.map(id => this.getCompetencies[id]).filter(Boolean);
            },
            ...mapState('employees', [
                'competencies',
                'currentFilter',
                'employeesRatings'
            ]),
            ...mapGetters('employees', [
                'getIndicators',
                'getEmployees',
                'getCompetencies',
                'getEmployeesTotalCount'
            ])
        },
        created() {
            this.$bus.$on('windowResize', this.setMinWidthPage);
            this.$bus.$on('updateRatings', this.updateRatings);
            this.$bus.$on('changeLoadBlock', this.setShowTable);
        },
        beforeDestroy() {
            this.$bus.$off('windowResize', this.setMinWidthPage);
            this.$bus.$off('updateRatings', this.updateRatings);
            this.$bus.$off('changeLoadBlock', this.setShowTable);
            document.querySelector(".header-wrap").style.minWidth = null;
        },
        mounted() {
            this.setMinWidthPage();
            document.querySelector(".list-employees-table-wrap").addEventListener("wheel", this.scrollPage.bind(this));
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .fixed {
        position: fixed;
        bottom: 0;
        z-index: 999;
        background: white;
    }

    .load {
        height: 759px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading-icon-employees {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 6px dashed #6fbe10;
        border-radius: 50%;
        vertical-align: -4px;
        cursor: default;
    }
</style>