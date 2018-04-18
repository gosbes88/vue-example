<template>
    <div class="search-employee filters-list-employees" :style="{width: widthColumn + 'px'}">
        <div class="search-employee__col-1">
            <div class="search-employee__col-wrap">
                <i class="search-employee__icon search-icon" :style="{background: 'url(' + searchIconImg + ') no-repeat'}"></i>
                <input class="search-employee__inp" type="search" :placeholder="translate('participants.searchKeywords')" :value="filters.filter" @input="changeFilter">
                <i class="search-close-icon"
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
                                  :elements="getDepartments"
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
</template>

<script>
    import mixin from '../../../mixins/utils';
    import searchIconImg from '../../../assets/img/search.svg';
    import closePopupIcon from '../../../assets/img/cross.svg';
    import { mapState } from 'vuex';

    export default {
        props: {
            widthColumn: {
                type: Number,
                required: true
            }
        },
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
        },
        watch: {
            positions(value) {
                this.tempPositions = value.orElse([]);
            },
            currentFilter(val) {
                let {departmentId, position, filter} = val.orElse({});
                if (departmentId !== this.selectedDepartment.id) {
                    this.selectedDepartment = departmentId
                            ? {id: departmentId, name: this.getDepartments.filter(d => d.id === departmentId)[0].name}
                            : this.defaultDepartment;
                }
                if (position !== this.selectedPosition) {
                    this.selectedPosition = position
                            ? { id: position, name: position }
                            : this.defaultPosition;
                }
                this.filters.filter = filter || "";
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
            getDepartments() {
                return this.departments.orElse([]);
            },
            ...mapState('employees', [
                'positions',
                'departments',
                'currentFilter'
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
                this.$emit('updateFilters', this.filters);
            }
        }
    };
</script>

<style>

</style>