<template>
    <div>
        <div class="result-card__wrap" v-if="employee && !isEmptyObject(employee)">
            <user :employee="employee"></user>

            <div class="competence-nav">
                <div class="competence-nav__container">
                    <button class="competence-nav__btn" :class="{'competence-selected-button': type === 'list'}" @click="type = 'list'" v-lang.survey.list2></button>
                    <button class="competence-nav__btn" :class="{'competence-selected-button': type !== 'list'}" @click="type = 'diagram'" v-lang.survey.diagram2></button>
                </div>
            </div>

            <div class="tab-content tab-content-scroll">
                <div role="tabpanel" class="tab-pane active">

                    <diagram v-if="type !== 'list'" :selected-relation="selectedRelation" :employee="employee"></diagram>

                    <div v-else class="competence-list-wrap">
                        <div class="competence-list competence-list--ind">
                            <div class="competence-item">
                                <div class="competence-item__title" v-lang.survey.ratesEmployees></div>
                                <div class="competence-item__num"
                                     :class="{'link': getSelectedEmployees.length > 0}"
                                     v-text="getSelectedEmployees.length"
                                     @click="showPopup = getSelectedEmployees.length > 0"
                                ></div>
                            </div>

                            <div class="competence-line"></div>

                            <employee-relation v-for="(item, index) in surveyRelationshipTypeWeights"
                                               :relation="item"
                                               :is-selected="isSelected(item)"
                                               :index="employee.index"
                                               :average-index="employee.avgIndex"
                                               :key="index"
                            ></employee-relation>
                        </div>
                    </div>
                </div>

                <div class="average-info" v-if="type === 'list'">
                    <span class="average-info__icon"></span> <span class="average-info__text" v-lang.survey.average></span>
                    <select-block :selected-element="selected"
                                  :elements="typeAverageIndex"
                                  @selectElement="changeIndex"
                    ></select-block>
                </div>
            </div>
            <result-employees-info @close="closePopup" :is-popup-viewed="showPopup" :employees="getSelectedEmployees"></result-employees-info>
            <slot name="footer"></slot>
        </div>
        <div class="result-card__wrap result-card__wrap--empty" v-else>
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    import mixins from '../../../mixins/utils';
    import { bus } from '../../../main';
    import { mapGetters } from 'vuex';

    export default {
        props: {
            selectedRelation: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                type: 'list',
                showPopup: false,
                employee: null,
                selected: {},
                typeAverageIndex: []
            };
        },
        created() {
            bus.$on('selectEmployee', employee => this.employee = employee);
            this.selected = {
                id: 'company',
                name: this.translate('survey.company')
            };
            this.typeAverageIndex = [
                {
                    id: 'company',
                    name: this.translate('survey.company')
                },
                {
                    id: 'department',
                    name: this.translate('survey.department')
                }
            ];
        },
        mixins: [ mixins ],
        components: {
            SelectBlock: () => import('../../common/Select.vue'),
            EmployeeRelation: () => import('./EmployeeRelationElement.vue'),
            Diagram: () => import('./EmployeeRelationsDiagram.vue'),
            User: () => import('./User.vue'),
            ResultEmployeesInfo: () => import('../../participant/ResultEmployeesInfo.vue')
        },
        methods: {
            changeIndex(type) {
                this.selected = type;
                //TODO: прописать логику для type.id - в зависимости от типа оценки по разному рассчитывается средний индекс по компании
            },
            closePopup() {
                this.showPopup = false;
            },
            isSelected(item) {
                return this.selectedRelation && item.relationshipType.id === this.selectedRelation;
            },
        },
        computed: {
            getSelectedEmployees() {
                return this.selectedRelation
                        ? this.getUniqueParticipantAnswersByQuestionIds(this.getQuestionIds, this.employee.id)
                        : this.getUniqueParticipantAnswers(this.employee.id);
            },
            getQuestionIds() {
                return this.surveyQuestions
                        .filter(q => q.questionRelationshipTypes.some(r => r.relationshipType.id === this.selectedRelation))
                        .map(q => q.id);
            },
            ...mapGetters('survey', [
                'getUniqueParticipantAnswers',
                'surveyQuestions',
                'getUniqueParticipantAnswersByQuestionIds',
                'surveyRelationshipTypeWeights'
            ])
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    .link {
        color: #6fbe10;
        cursor: pointer;
    }
</style>