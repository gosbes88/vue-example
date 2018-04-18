<template>
    <div class="projects-group">
        <div class="projects-group__item-1">
            <div class="container-default mt-5">
                <div class="container-small">
                    <div class="text-center">
                        <h1 class="title-big-page" v-lang.networks></h1>

                        <div v-if="participantSurveysByType(getSelectOrganization.employeeId, 'NEW').length">
                            <div class="text-center">
                                <h2 class="title-page" v-lang.survey.newSurveys></h2>
                            </div>

                            <survey-item v-for="(survey, index) in participantSurveysByType(getSelectOrganization.employeeId, 'NEW')" :survey="survey" :key="index"></survey-item>
                        </div>

                        <div v-if="participantSurveysByType(getSelectOrganization.employeeId, 'ACTIVE').length">
                            <div class="text-center">
                                <h2 class="title-page" v-lang.survey.activeSurveys></h2>
                            </div>

                            <survey-item v-for="(survey, index) in participantSurveysByType(getSelectOrganization.employeeId, 'ACTIVE')" :survey="survey" :key="index"></survey-item>
                        </div>

                        <div v-if="participantSurveysByType(getSelectOrganization.employeeId, 'COMPLETED').length">
                            <div class="text-center">
                                <h2 class="title-page" v-lang.survey.doneSurveys></h2>
                            </div>

                            <survey-item v-for="(survey, index) in participantSurveysByType(this.getSelectOrganization.employeeId, 'COMPLETED')" :survey="survey" :key="index"></survey-item>
                        </div>


                    </div>
                </div>
            </div>
        </div>

        <div class="projects-group__item-2">
            <div class="section-completed-project">

                <div class="container-small">
                    <div v-if="surveysByType('COMPLETED').length">
                        <div class="text-center">
                            <h2 class="title-page" v-lang.survey.completedSurveysParticipant></h2>
                        </div>

                        <survey-item v-for="(survey, index) in surveysByType('COMPLETED')" :survey="survey" :key="index"></survey-item>
                    </div>

                    <div class="result-project">
                        <div class="result-project__item">
                            <div class="result-project__title" v-lang.survey.allSurveys></div>
                            <div class="result-project__num" v-text="surveys.orElse([]).length"></div>
                        </div>
                        <div class="result-project__item">
                            <div class="result-project__title" v-lang.survey.completedSurveys></div>
                            <div class="result-project__num" v-text="completed.length"></div>
                        </div>
                        <div class="result-project__item">
                            <div class="result-project__title" v-lang.survey.allParticipants></div>
                            <div class="result-project__num" v-text="allParticipants.length"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        head: {
            title() {
                return {
                    inner: this.translate('survey.title')
                };
            }
        },
        components: {
            SurveyItem: () => import('./SurveyItem.vue')
        },
        created() {
            this.$store.commit('setFooterView', true);
            this.$store.commit('changeFilledFooter', true);
            this.getSurveysByParticipant();
        },
        methods: {
            participantSurveysByType(id, type = "ACTIVE") {
                const allActiveSurveys = this.surveysByType('ACTIVE');
                return allActiveSurveys.filter(s => {
                    const participant = s.participants.filter(p => p.employeeId === id)[0];
                    if (participant) {
                        return type === 'ACTIVE'
                                ? participant.startedSurvey && participant.answers.length < s.questions.length
                                :  type === 'COMPLETED'
                                        ? participant.answers.length > 0 && participant.answers.length === s.questions.length
                                        : !participant.startedSurvey;
                    }
                    return false;
                });
            },
            ...mapActions('participant', [
                'getSurveysByParticipant'
            ])
        },
        computed: {
            completed() {
                return [...this.surveysByType('COMPLETED'), ...this.participantSurveysByType(this.getSelectOrganization.employeeId, 'COMPLETED')];
            },
            ...mapGetters([
                'getSelectOrganization'
            ]),
            ...mapGetters('participant', [
                'surveysByType',
                'allParticipants'
            ]),
            ...mapState('participant', [
                'surveys'
            ])
        }
    };
</script>