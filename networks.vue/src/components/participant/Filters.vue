<template>
    <div class="filter-surveys" v-show="showFilters">
        <div class="filter-surveys__col-1">
            <div class="search-container">
                <i class="search-container__icon search-icon" :style="{background: 'url(' + searchIconImg + ') no-repeat'}"></i>
                <input class="search-container__inp" type="search" :placeholder="translate('survey.searchEmployees')" :value="filters.filter" @input="changeFilter">
                <i class="search-container__close-icon search-close-icon close-light-icon"
                   :class="{'search-close-icon--show': filters.filter.length > 0 }"
                   :style="{background: 'url(' + closePopupIcon + ') no-repeat'}"
                   @click="clearFilter"></i>
            </div>
        </div>

        <div class="filter-surveys__col-2">
            <select-component :elements="departments.orElse([])"
                              :selectedElement="selectedDepartment"
                              :defaultText="translate('participants.allDepartments')"
                              :classElementsWrapper="'select-top'"
                              @selectElement="selectDepartment"
            ></select-component>
        </div>

        <div class="filter-surveys__col-3">
            <select-component :elements="getPositions"
                              :selectedElement="selectedPosition"
                              :defaultText="translate('participants.allPositions')"
                              :classElementsWrapper="'select-top'"
                              @selectElement="selectPosition"
            ></select-component>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import mixins from '../../mixins/utils';
    import { MAX_VISIBLE_EMPLOYEES_COUNT } from '../../utils/Constants';
    import searchIconImg from '../../assets/img/search.svg';
    import closePopupIcon from '../../assets/img/cross.svg';

    export default {
        data() {
            return {
                searchIconImg,
                closePopupIcon,
                minCountForSearch: 10,
                filters: {
                    filter: "",
                    position: null,
                    departmentId: null
                },
                selectedPosition: {},
                selectedDepartment: {},
                defaultDepartment: {},
                defaultPosition: {},
                tempPositions: [],
            };
        },
        components: {
            SelectComponent: () => import('../common/Select.vue')
        },
        mixins: [ mixins ],
        created() {
            this.selectedPosition = this.defaultPosition = {
                id: this.translate("participants.allPositions"),
                name: this.translate("participants.allPositions")
            };
            this.selectedDepartment = this.defaultDepartment = {
                id: this.translate("participants.allDepartments"),
                name: this.translate("participants.allDepartments")
            };
            this.$bus.$on("clear", this.clearFilters);
        },
        watch: {
            positions(value) {
                this.tempPositions = value.orElse([]);
            }
        },
        methods: {
            clearFilters() {
                this.filters = {
                    filter: "",
                    position: null,
                    departmentId: null
                };
                this.selectedPosition = {
                    id: this.translate("participants.allPositions"),
                    name: this.translate("participants.allPositions")
                };
                this.selectedDepartment = {
                    id: this.translate("participants.allDepartments"),
                    name: this.translate("participants.allDepartments")
                };
            },
            selectPosition(selected) {
                this.filters.position = selected.id !== this.defaultPosition.id ? selected.id : null;
                this.selectedPosition = this.getPositions.filter(position => position.id === selected.id)[0] || this.defaultPosition;
                this.updateFilters();
            },
            selectDepartment(selected) {
                this.selectedDepartment = this.departments.orElse([]).filter(department => department.id === selected.id)[0] || this.defaultDepartment;
                this.filters.departmentId = this.selectedDepartment.id  !== this.defaultDepartment.id ? this.selectedDepartment.id : null;
                this.searchPositions(this.filters.departmentId);
            },
            changeFilter(event) {
                this.filters.filter = event.target.value.trim();
                this.updateFilters();
            },
            clearFilter() {
                this.filters.filter = "";
                this.updateFilters();
            },
            updateFilters() {
                let {filter, position, departmentId} = this.filters;
                /**
                 * К MAX_VISIBLE_EMPLOYEES_COUNT добавлено 2, чтобы исключить без ущерба числу самого проходящего сотрудника и узнать, что в организации больше 200 человек
                 * для указания информации проходящему о том, что не все сотрудники показаны
                 */
                this.getEmployeesByFilters({filter, position, departmentId, employeeIds: [], limit: MAX_VISIBLE_EMPLOYEES_COUNT + 2, offset: null, includeDismissed: false});
            },
            searchPositions(departmentId) {
                let root = this;
                (async () => {
                    try {
                        if (!departmentId || departmentId === this.defaultDepartment.id) {
                            root.tempPositions = root.positions.orElse([]);
                        } else {
                            let response = await root.$http.get('/organizations/service/rest/organization/positions/search', {params: {departmentId}});
                            root.tempPositions = response.body;
                            if (!root.tempPositions.some(position => position === root.selectedPosition.id)) {
                                root.filters.position = null;
                                root.selectedPosition = root.defaultPosition;
                            }
                        }
                        root.updateFilters();
                    } catch(e) {
                        console.log(e);
                    }
                })();
            },
            ...mapActions('survey', [
                'getEmployeesByFilters'
            ])
        },
        computed: {
            showFilters() {
                return this.employees.orElse([]).length > this.minCountForSearch || !this.isEmptyObject(this.filters);
            },
            getPositions() {
                return this.tempPositions.map(position => {return {id: position, name: position};});
            },
            ...mapState('survey', [
                'employees',
                'departments',
                'positions'
            ])
        },
        beforeDestroy() {
            this.$bus.$off("clear", this.clearFilters);
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    .select-top {
        bottom: 30px;
        top: inherit;
    }
</style>