<template>
    <router-link class="project-block-wrapper" tag="div" :class="{'project-block-wrapper--done': isCompleted()}" :to="nextStep">

            <a class="project-block">
                <div class="project-block__item project-block__item-1">
                    <div class="project-block-info">
                        <div class="project-block-info__item project-block-info__item-1">
                            <h3 class="project-item__title" v-text="survey.name"></h3>
                        </div>

                        <div class="project-block-info__item project-block-info__item-2">
                            <div class="project-block-info__text ml-3">
                                <div>
                                    <span class="project-block-info__title" v-lang.survey.status></span>
                                    <span class="project-block-info__value" v-text="translate('survey.' + survey.statusType)"></span>
                                </div>

                                <div>
                                    <span class="project-block-info__title" v-lang.survey.starting></span>
                                    <span class="project-block-info__value" v-text="getStartDate"></span>
                                </div>

                                <div>
                                    <span class="project-block-info__title" v-lang.survey.ending></span>
                                    <span class="project-block-info__value" v-text="getEndDate"></span>
                                </div>
                            </div>
                        </div>

                        <div class="project-block-info__item project-block-info__item-3">
                            <div class="project-block-info__text">
                                <div>
                                    <span class="project-block-info__title" v-text="translate('survey.allParticipants') + ':'"></span>
                                    <span class="project-block-info__value" v-text="survey.participants.length"></span>
                                </div>
                                <div>
                                    <span class="project-block-info__title" v-lang.survey.endTasks></span>
                                    <span class="project-block-info__value" v-text="`${getCurrentStage} ${translate('out')} ${survey.questions.length}`"></span>
                                </div>
                                <div>
                                    <span class="project-block-info__title" v-lang.survey.participantCompleted></span>
                                    <span class="project-block-info__value" v-text="completedPercent + '%'"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project-block__item project-block__item-2">
                    <div class="project-block__arrow-icon button-link">
                        <i class="arrow-right-big-green-icon" :style="{background: 'url(' + GreenArrowImg + ') no-repeat'}"></i>
                    </div>
                </div>
            </a>

    </router-link>
</template>

<script>
    import GreenArrowImg from '../../assets/img/arrow-right-big-green.svg';
    import { mapGetters } from 'vuex';

    export default {
        props: {
            survey: {
                type: Object,
                default: () => { return {}; }
            }
        },
        data() {
            return {
                GreenArrowImg,
                stages: {
                    'false': {name: 'Greeting', params: {id: this.survey.id}},
                    'true': {name: 'Answer', params: {id: this.survey.id}},
                    'COMPLETED': {name: 'Result', params: {id: this.survey.id}}
                }
            };
        },
        methods: {
            isCompleted() {
                if (this.stages[this.survey.statusType]) {
                    return this.stages['COMPLETED'];
                }
            }
        },
        computed: {
            getStartDate() {
                const startDate = this.survey.startDate ? (new Date(this.survey.startDate)) : null;
                return startDate
                        ? `${startDate.getDate().toString().replace(/^([0-9])$/, '0$1')} ${this.translate('month.full' + startDate.getMonth())} ${startDate.getFullYear()}`
                        : this.translate('survey.dateEmpty');
            },
            getEndDate() {
                const endDate = this.survey.endDate ? (new Date(this.survey.endDate)) : null;
                return endDate
                        ? `${endDate.getDate().toString().replace(/^([0-9])$/, '0$1')} ${this.translate('month.full' + endDate.getMonth())} ${endDate.getFullYear()}`
                        : this.translate('survey.dateEmpty');
            },
            getCurrentStage() {
                let id = this.getSelectOrganization.employeeId;
                let participant = this.survey.participants.filter(p => p.employeeId === id)[0];
                return participant ? participant.answers.length : 0;
            },
            isSurveyStarted() {
                let id = this.getSelectOrganization.employeeId;
                let participant = this.survey.participants.filter(p => p.employeeId === id)[0];
                return participant.startedSurvey;
            },
            completedPercent() {
                let completedSize = this.survey.participants.filter(p => p.answers.length === this.survey.questions.length).length;
                return this.survey.questions.length
                    ? parseInt(completedSize / this.survey.questions.length * 100)
                    : 0;
            },
            nextStep() {
                if (this.stages[this.survey.statusType] || this.getCurrentStage === this.survey.questions.length) {
                    return this.stages['COMPLETED'];
                }
                return this.stages[this.isSurveyStarted];
            },
            ...mapGetters([
                'getSelectOrganization'
            ])
        }
    };
</script>