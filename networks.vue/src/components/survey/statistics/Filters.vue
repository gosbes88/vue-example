<template>
    <div>
        <div class="participants-filters">
            <select-item class="participants-filters__item" :elements="departments.orElse([])"
                              :selectedElement="selectedDepartment"
                              :defaultText="translate('participants.allDepartments')"
                              @selectElement="selectDepartment"
            ></select-item>


            <select-item class="participants-filters__item" :elements="getPositions"
                              :selectedElement="selectedPosition"
                              :defaultText="translate('participants.allPositions')"
                              @selectElement="selectPosition"
            ></select-item>
        </div>

        <div class="employees-search employees-search--margin-none">
            <i class="employees-search__icon search-icon" :style="{background: 'url(' + searchIconImg + ') no-repeat'}"></i>
            <input class="employees-search__inp employees-search__inp--width js-search" type="search" :placeholder="translate('survey.searchEmployees')" :value="filters.filter" @input="changeFilter">
            <i class="search-close-icon"
               :class="{'search-close-icon--show': filters.filter.length > 0 }"
               :style="{background: 'url(' + closePopupIcon + ') no-repeat'}"
               @click="clearFilter">
            </i>
        </div>
    </div>
</template>

<script>
    import searchIconImg from '../../../assets/img/search.svg';
    import closePopupIcon from '../../../assets/img/cross.svg';
    import SelectItem from '../../common/Select.vue';
    import mixins from '../../../mixins/utils';
    import { mapState, mapActions, mapGetters } from 'vuex';

    export default {
        data() {
            return {
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
                searchIconImg,
                closePopupIcon
            };
        },
        mixins: [ mixins ],
        components: {
            SelectItem
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
            }
        },
        computed: {
            getPositions() {
                return this.tempPositions.map(position => {return {id: position, name: position};});
            },
            ...mapGetters('survey', [
                'getParticipateEmployeesIds'
            ]),
            ...mapState('survey', [
                'departments',
                'positions'
            ])
        },
        methods: {
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
                this.$emit('updateFilters', this.filters);
                this.getEmployeesByFilters({filter, position, departmentId, employeeIds: this.getParticipateEmployeesIds, includeDismissed: false})
            },
            searchPositions(departmentId) {
                let root = this;
                (async () => {
                    try {
                        if (!departmentId || departmentId === root.defaultDepartment.id) {
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
        }
    };
</script>