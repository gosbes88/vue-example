<template>
    <div>
        <router-link class="completed-project-item" :to="{name: 'SurveyResults', params: {id: survey.id}}">
            <div class="projects-info">

                <div class="projects-info__col-1">
                    <h3 class="completed-project-item__title" v-text="survey.name || translate('survey.noSummary')"></h3>

                    <div class="projects-info__desc">
                        <div class="projects-info__item-1">
                            <div class="projects-info-row">
                                <div class="projects-info-row__title" v-lang.survey.starting></div>
                                <div class="projects-info-row__desc" v-text="getDate(survey.startDate)"></div>
                            </div>

                            <div class="projects-info-row">
                                <div class="projects-info-row__title" v-lang.survey.ending></div>
                                <div class="projects-info-row__desc" v-text="getDate(survey.endDate)"></div>
                            </div>
                        </div>

                        <div class="projects-info__item-2">
                            <div class="projects-info-row">
                                <div class="projects-info-row__title" v-lang.survey.status></div>
                                <div class="projects-info-row__desc" v-text="translate(`survey.${survey.statusType}`)"></div>
                            </div>
                        </div>

                        <div class="projects-info__item-4">
                            <div class="projects-info-row">
                                <div class="projects-info-row__title" v-lang.survey.relationType></div>
                                <div class="projects-info-row__desc" v-text="relationNames"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="projects-info__col-2">
                    <div class="statistics-circle statistics-circle-small statistics-circle-done">
                        <vue-circle class="statistics-circle__progress z-1"
                                    :progress="completedPercent"
                                    :size="105"
                                    :reverse="false"
                                    line-cap="round"
                                    :fill="progressColor"
                                    empty-fill="transparent"
                                    :animation="false"
                                    :start-angle="completedPercent | getStartAngle"
                                    :thickness="6"
                                    :show-percent="false"
                                    insert-mode="append"
                        ></vue-circle>
                        <div class="statistics-circle__container">
                            <div class="graph-test__total">
                                <div class="graph-test__text" v-lang.fulfilled></div>
                                <div class="graph-test__num" v-text="completedPercent + '%'"></div>
                            </div>
                        </div>
                        <div class="statistics-circle__line"></div>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
    import mixins from '../../mixins/utils';
    import indicators from '../../mixins/Indicators';
    import VueCircle from 'vue2-circle-progress';

    export default {
        props: {
            survey: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            VueCircle
        },
        mixins: [ indicators, mixins ],
        methods: {
            getDate(date) {
                return date
                    ? (new Date(date)).getDate() + " " + this.translate(`month.full${(new Date(date)).getMonth()}`) + " " + (new Date(date)).getFullYear()
                    : this.translate('survey.noDate');
            }
        },
        computed: {
            completedPercent() {
                return this.survey.participants.length
                    ?  parseInt(this.completedSize / this.survey.participants.length * 100)
                    : 0;
            },
            completedSize() {
                const questionsCount = this.survey.questions.length;
                return this.survey.participants.filter(p => p.answers.length === questionsCount).length;
            },
            progressColor() {
                return { color: this.getColor(this.completedPercent)};
            },
            relationNames() {
                return this.survey.relationshipTypeWeights.reduce((result, r, index, arr) => {
                    return result + r.relationshipType.name + (index < arr.length - 1 ? ", " : "");
                }, "");
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .statistics-circle-small {
        width: 105px;
        height: 105px;
    }
</style>