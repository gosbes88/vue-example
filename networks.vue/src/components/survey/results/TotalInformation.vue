<template>
    <div>
        <div v-if="!showDiagram">
            <filter-block @updateFilters="updateFilters"></filter-block>
            <div class="emp-tb-wr">
                <table class="e-tb">
                    <tbody v-if="getRatings.length">
                        <tr class="e-tb__row"
                            :class="{'e-tb__row-hover': selectedEmployee && selectedEmployee.id === employee.id}"
                            v-for="(employee, index) in employeesByRelation"
                            :key="index"
                            @click="selectEmployee(employee)"
                        >
                            <td class="e-tb__us">
                                <div class="us">
                                    <img class="us__pic" :src="getAvatar(employee)">
                                    <div class="us__con">
                                        <div class="us__fam" v-text="getParticipantInfo(employee)"></div>
                                        <div class="us__dep" v-text="getPositionWithDepartment(employee)"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="e-tb__pr e-tb__pr--indent">
                                <div class="pr" v-text="employee.index"></div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="2">
                                <div class="not-found-employee" v-lang.participants.notFound></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <diagram v-else :relation="relation"></diagram>
    </div>
</template>

<script>
    import employeeData from '../../../mixins/EmployeeData';
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
    import { CENTRALITY_INDEX_ID } from '../../../utils/Constants';
    import { bus } from '../../../main';

    export default {
        data() {
            return {
                selectedEmployee: {},
                filters: {}
            };
        },
        props: {
            showDiagram: {
                type: Boolean,
                default: true
            },
            relation: {
                type: String,
                default: null
            }
        },
        mixins: [ employeeData ],
        components: {
            FilterBlock: () => import('./FilterBlock.vue'),
            Diagram: () => import('./RelationDiagram.vue')
        },
        watch: {
            relation(val) {
                if (!val) {
                    this.getAllEmployeesCentralityIndex({...this.filters, employeesIds: this.getParticipateEmployeesIds, competenciesIds: [CENTRALITY_INDEX_ID]});
                } else {
                    this.getEmployeesByRelation(val).length > 0
                            ? this.getAllEmployeesCentralityIndex({...this.filters, employeesIds: this.getEmployeesByRelation(val), competenciesIds: [CENTRALITY_INDEX_ID]})
                            : this.fillEmployeesRatings({value: {}});
                }
            },
            employeesRatings(val) {
                if (!this.existsEmployeeInEmployeesRatings(this.selectedEmployee.id)) {
                    this.selectedEmployee = {};
                    bus.$emit('selectEmployee', this.selectedEmployee);
                }
            }
        },
        computed: {
            employeesByRelation() {
                return Array.from(this.getRatings)
                        .map(r => {
                            const rating = r.ratings.filter(r => r.competenceId === CENTRALITY_INDEX_ID)[0] || {};
                            return {
                                ...r.employee,
                                avgIndex: !rating.avgValue && rating.avgValue !== 0 ? null : parseFloat(rating.avgValue.toFixed(2)),
                                index: !rating.value && rating.value !== 0 ? null : parseFloat(rating.value.toFixed(2))
                            };
                        })
                        .sort(this.sortFunction(this.filters.sort));
            },
            ...mapState('survey', [
                'survey',
                'employeesRatings'
            ]),
            ...mapGetters('survey', [
                'existsEmployeeInEmployeesRatings',
                'getRatings',
                'getParticipateEmployeesIds',
                'addedEmployees',
                'surveyQuestions'
            ])
        },
        methods: {
            updateFilters(filters = {}) {
                this.filters = filters;
                this.getAllEmployeesCentralityIndex({...filters, employeesIds: this.getParticipateEmployeesIds, competenciesIds: [CENTRALITY_INDEX_ID]});
            },
            getEmployeesByRelation(relation) {
                let questionIds = this.surveyQuestions
                        .filter(q => q.questionRelationshipTypes.some(r => r.relationshipType.id === relation))
                        .map(q => q.id);
                return this.addedEmployees
                        .filter(p => p.answers.some(a => questionIds.includes(a.questionId)))
                        .map(p => p.employeeId);
            },
            selectEmployee(employee) {
                this.selectedEmployee = this.selectedEmployee.id === employee.id ? {} : employee;
                bus.$emit('selectEmployee', this.selectedEmployee);
            },
            ...mapMutations('survey', [
                'fillEmployeesRatings'
            ]),
            ...mapActions('survey', [
                'getAllEmployeesCentralityIndex'
            ])
        }
    };
</script>