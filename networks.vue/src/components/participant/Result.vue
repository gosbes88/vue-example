<template>
    <div class="container-default">
        <div class="breadcrumb">
            <router-link class="btn-prev anim-hover-left" :to="{name: 'Participant'}">
                <i class="btn-prev__icon arrow-left-gray-icon anim anim-icon" :style="{background: 'url(' + ArrowLeftGrayImg + ') no-repeat'}"></i>
                <span class="btn-prev__text" v-lang.survey.surveysBack></span>
            </router-link>
        </div>

        <article class="container-small">
            <div class="center-block mb-5">
                <img src="../../assets/img/hello.png">
            </div>

            <div v-if="participantAnswers(getSelectOrganization.employeeId).length === surveyQuestions.length || survey.orElse({}).statusType === 'COMPLETED'">
                <div class="center-block">
                    <h1 class="title-big-page" v-text="surveyCompleted"></h1>
                </div>

                <div class="page-result__subtitle text-center" v-lang.survey.thanks></div>

                <div class="results-surveys">
                    <h3 class="results-surveys__title">Результаты опросов</h3>
                    <div class="list-completed-surveys">

                        <div class="list-completed-surveys__item" is="ResultQuestionStatistics" v-for="(question, index) in surveyQuestions"
                             :question="question"
                             :key="index"
                             :index="index"
                             @showEmployees="showEmployees"
                        ></div>
                    </div>
                </div>

                <div class="indicators">
                    <div class="indicators-text">
                        <h3 class="indicators__title text-center" v-lang.survey.resultsRates></h3>

                        <div class="indicators-text__list">
                            <div class="indicators-text__item">
                                <div class="indicators-text__title" v-lang.survey.timeSpent></div>
                                <div class="indicators-text__num" v-text="time"></div>
                            </div>

                            <div class="indicators-text__item">
                                <div class="indicators-text__title" v-lang.survey.answered></div>
                                <div class="indicators-text__num" v-text="`${participantAnswers(getSelectOrganization.employeeId).length} ${translate('out')} ${surveyQuestions.length}`"></div>
                            </div>

                            <div class="indicators-text__item">
                                <div class="indicators-text__title" v-lang.survey.ratesEmployees></div>
                                <div class="indicators-text__num" v-text="getUniqueParticipantAnswers(getSelectOrganization.employeeId).length"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="center-block" v-else>
                <h1 class="title-big-page" v-lang.survey.ratedEmpty></h1>
            </div>
        </article>
        <result-employees-info @close="closePopup" :is-popup-viewed="showPopup" :employees="employees"></result-employees-info>
    </div>
</template>

<script>
    import ArrowLeftGrayImg from '../../assets/img/arrow-left-dark-gray.svg';
    import mixins from '../../mixins/utils';
    import { mapActions, mapState, mapGetters } from 'vuex';

    export default {
        data() {
            return {
                ArrowLeftGrayImg,
                showPopup: false,
                employees: [],
                completionReason: {
                    'MANAGER': '',
                    'TIME_UP': ''
                }
            };
        },
        components: {
            ResultQuestionStatistics: () => import('./ResultQuestionStatistics.vue'),
            ResultEmployeesInfo: () => import('./ResultEmployeesInfo.vue')
        },
        mixins: [ mixins ],
        head: {
            title() {
                return {
                    inner: `${this.translate('survey.completed')} - ${this.survey.orElse({}).name}`
                };
            }
        },
        created() {
            this.completionReason['MANAGER'] = this.translate('survey.manager');
            this.completionReason['TIME_UP'] = this.translate('survey.time');
            this.$store.commit('setFooterView', true);
            this.getSurveyData();
        },
        computed: {
            time() {
                let result = '';
                const isParticipantCompleted = this.participantAnswers(this.getSelectOrganization.employeeId).length === this.surveyQuestions.length;
                const answers = Array.from(this.participantAnswers(this.getSelectOrganization.employeeId))
                        .sort((a, b) => new Date(a.updatedTime) > new Date(b.updatedTime));
                if (answers && answers.length > 0) {
                    const delta = (isParticipantCompleted ? new Date(answers[answers.length - 1].updatedTime) : new Date(this.survey.orElse({}).endDate)) - new Date(answers[0].updatedTime);
                    const diffSeconds = parseInt(delta / 1000 % 60);
                    const diffMinutes = parseInt(delta / (60 * 1000) % 60);
                    const diffHours = parseInt(delta / (1000 * 60 * 60) % 24);
                    const diffDays = parseInt(delta / (1000 * 60 * 60 * 24));
                    result += diffDays ? `${diffDays} д.` : '';
                    result += diffHours ? `${diffHours} ч.` : '';
                    result += diffMinutes ? `${diffMinutes} м.` : '';
                    result += diffSeconds ? `${diffSeconds} с.` : '';
                }

                return result;
            },
            surveyCompleted() {
                if (this.survey.orElse({}).statusType === 'ACTIVE') {
                    return this.translate('survey.completed');
                } else if (this.survey.orElse({}).completionType) {
                    return this.completionReason[this.survey.orElse({}).completionType] || this.translate('survey.finished');
                } else {
                    return this.translate('survey.finished');
                }
            },
            ...mapState('survey', [
                'survey'
            ]),
            ...mapGetters('survey', [
                'surveyQuestions',
                'participantAnswers',
                'getUniqueParticipantAnswers'
            ]),
            ...mapGetters([
                'getSelectOrganization'
            ]),
        },
        methods: {
            showEmployees(employees) {
                this.employees = employees;
                this.showPopup = true;
            },
            closePopup() {
                this.showPopup = false;
                this.employees = [];
            },
            ...mapActions('survey', [
                'getSurveyData'
            ])
        }
    };
</script>