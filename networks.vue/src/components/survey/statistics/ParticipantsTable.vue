<template>
    <div>
        <table class="participants-project">
            <thead>
                <tr class="participants-project__row">
                    <th class="participants-project__title participants-project__user-info" v-html="translate('survey.tableName')"></th>

                    <th class="participants-project__title participants-project__completed-tasks js-sort" data-type="completenessPercent">
                        <span v-html="translate('survey.tableCompletedTasks')"></span>
                        <i class="fa hide"></i>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr is="participant-row" v-for="(item, index) in employees.orElse([])" :key="index" :participant="item"></tr>
                <tr v-if="employees.orElse([]).length === 0">
                    <td colspan="2" style="text-align: center; vertical-align: middle;padding: 20px 0 0 0;" v-lang.survey.tableNotFound></td>
                </tr>
            </tbody>
        </table>
        <infinite-loading style="width: 100%" @infinite="loadEmployees" ref="infiniteLoading">
            <span slot="no-more"></span>
            <span slot="no-results"></span>
            <span slot="spinner"></span>
        </infinite-loading>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
    import { EMPLOYEES_LIMIT, fillFormData, FORM_HEADERS } from '../../../utils/Constants';

    export default {
        props: {
            filters: {
                type: Object,
                default: () => { return {}; }
            }
        },
        data() {
            return {
                offset: 0,
                timer: null
            };
        },
        watch: {
            employees(value) {
                this.offset = value.orElse([]).length % 20 !== 0
                        ? Math.ceil((value.orElse([]).length / 20)) * 20 + 20
                        : value.orElse([]).length
            },
            filters(val) {
                this.offset = 0;
                this.changeFilter();
                let { filter, position, departmentId } = val;
                this.getEmployeesByFilters({filter, position, departmentId, employeeIds: this.getParticipateEmployeesIds, limit: EMPLOYEES_LIMIT, includeDismissed: false});
            }
        },
        components: {
            ParticipantRow: () => import('./ParticipantRow.vue'),
            InfiniteLoading: () => import('vue-infinite-loading')
        },
        computed: {
            ...mapState('survey', [
                'employees'
            ]),
            ...mapGetters('survey', [
                'getParticipateEmployeesIds'
            ])
        },
        methods: {
            changeFilter() {
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            loadEmployees($state) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    let { filter, position, departmentId } = this.filters;
                    let response = this.$http.post('/organizations/service/rest/employees/search',
                            fillFormData({filter, position, departmentId, employeeIds: this.getParticipateEmployeesIds, limit: EMPLOYEES_LIMIT, offset: this.offset , includeDismissed: false}),
                            FORM_HEADERS
                        )
                        .then(response => {
                            if (!response.body.length) {
                                $state.complete();
                            } else {
                                $state.loaded();
                                const ids = response.body.map(r => r.id);
                                let availableEmployees = this.employees.orElse([]).filter(e => !ids.includes(e.id));
                                this.fillEmployees({values: availableEmployees.concat(response.body)});
                                this.offset += EMPLOYEES_LIMIT;
                            }
                        })
                        .catch(error => console.error(error));
                });
            },
            ...mapMutations('survey', [
                'fillEmployees'
            ]),
            ...mapActions('survey', [
                'getEmployeesByFilters'
            ])
        }
    };
</script>