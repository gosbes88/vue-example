<template>
    <div :class="{'block-disabled' : disabled}">
        <div class="search-employee mb-4">
            <div class="search-employee__col-1">
                <div class="search-employee__col-wrap">
                    <i class="search-employee__icon search-icon" :style="{background: 'url(' + searchIconImg + ') no-repeat'}"></i>
                    <input class="search-employee__inp" type="search" :placeholder="translate('participants.lastName')" :value="filters.filter" @input="changeFilter">
                    <i class="search-close-icon search-close-icon--ind"
                       :class="{'search-close-icon--show': filters.filter.length > 0 }"
                       :style="{background: 'url(' + closePopupIcon + ') no-repeat'}"
                       @click="clearFilter">
                    </i>
                </div>
            </div>

            <div class="search-employee__col-2">
                <div class="search-employee__col-wrap">
                    <select-component class="search-employee__select"
                                      :class="{ 'select-wrapper--font-small': selectedDepartmentLength }"
                                      :elements="departments.orElse([])"
                                      :selectedElement="selectedDepartment"
                                      :defaultText="translate('participants.allDepartments')"
                                      @selectElement="selectDepartment"
                    ></select-component>
                </div>
            </div>

            <div  class="search-employee__col-3">
                <div class="search-employee__col-wrap">
                    <select-component class="search-employee__select"
                                      :class="{ 'select-wrapper--font-small': selectedPositionLength }"
                                      :elements="getPositions"
                                      :selectedElement="selectedPosition"
                                      :defaultText="translate('participants.allPositions')"
                                      @selectElement="selectPosition"
                    ></select-component>
                </div>
            </div>
        </div>

        <div v-if="showTotalReset" class="reset-search" :class="{'hide': isEmptyObject(filters)}">
            <a class="reset-search__link" href="javascript:void(0);" v-lang.participants.reset @click.prevent="clearFilters"></a>
        </div>
    </div>
</template>

<script>
    import mixin from '../../../mixins/utils';
    import searchIconImg from '../../../assets/img/search.svg';
    import closePopupIcon from '../../../assets/img/cross.svg';
    import { mapState } from 'vuex';

    export default {
        data() {
            return {
                filters: {
                    position: null,
                    departmentId: null,
                    filter: ""
                },
                selectedPosition: {},
                selectedDepartment: {},
                defaultDepartment: {},
                defaultPosition: {},
                tempPositions: [],
                searchIconImg,
                closePopupIcon
            };
        },
        props: {
            type: {
                type: String,
                default: ""
            },
            disabled: {
                type: Boolean,
                default: false
            },
            showTotalReset: {
                type: Boolean,
                default: true
            }
        },
        mixins: [ mixin ],
        components: {
            SelectComponent: () => import('../../common/Select.vue')
        },
        created() {
            this.selectedPosition = this.defaultPosition = {
                id: this.translate("participants.allPositions"),
                name: this.translate("participants.allPositions")
            };
            this.selectedDepartment = this.defaultDepartment = {
                id: this.translate("participants.allDepartments"),
                name: this.translate("participants.allDepartments")
            };
            this.tempPositions = this.positions.orElse([]);
        },
        watch: {
            positions(value) {
                this.tempPositions = value.orElse([]);
            }
        },
        computed: {
            selectedDepartmentLength() {
                return this.selectedDepartment.name.length > 17;
            },

            selectedPositionLength() {
                return this.selectedPosition.name.length > 17;
            },
            getPositions() {
                return this.tempPositions.map(position => {return {id: position, name: position};});
            },
            ...mapState('survey', [
                'positions',
                'departments'
            ])
        },
        methods: {
            searchPositions(departmentId) {
                let root = this;
                (async () => {
                    try {
                        if (!departmentId || departmentId === this.defaultDepartment.id) {
                            this.tempPositions = this.positions.orElse([]);
                        } else {
                            let response = await root.$http.get('/organizations/service/rest/organization/positions/search', {params: {departmentId}});
                            root.tempPositions = response.body;
                            if (!root.tempPositions.some(position => position === root.selectedPosition.id)) {
                                root.filters.position = null;
                                this.selectedPosition = this.defaultPosition;
                            }
                        }
                        root.updateFilters();
                    } catch(e) {
                        console.log(e);
                    }
                })();
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
            clearFilter() {
                this.filters.filter = "";
                this.updateFilters();
            },
            clearFilters() {
                this.filters = {
                    position: null,
                    departmentId: null,
                    filter: ""
                };
                this.selectedPosition = this.defaultPosition;
                this.selectedDepartment = this.defaultDepartment;
                this.updateFilters();
            },
            changeFilter(event) {
                this.filters.filter = event.target.value.trim();
                this.updateFilters();
            },
            updateFilters() {
                this.$emit('updateFilters', this.filters, this.type);
            }
        }
    };
</script>

<style>

</style>