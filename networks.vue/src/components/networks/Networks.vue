<template>
    <div class="container-default">
        <div class="page-home">
            <networks-actions :recommendationsCount="recommendationsCount"></networks-actions>

            <div class="profiles__item-2" v-if="getAllSurveys.length > 0">
                <div>
                    <h2 class="title-middle-page" v-lang.currentSurveys></h2>

                    <div class="project-results">
                        <div class="project-results__item">
                            <div class="project-results__round-not-start"></div>
                            <div class="project-results__title" v-lang.notStarted></div>
                        </div>

                        <div class="project-results__item">
                            <div class="project-results__round-perform"></div>
                            <div class="project-results__title" v-lang.active></div>
                        </div>

                        <div class="project-results__item">
                            <div class="project-results__round-completed"></div>
                            <div class="project-results__title" v-lang.completed1></div>
                        </div>
                    </div>


                    <div :is="getAvailableSurveys.length > 5 ? 'surveys-carousel' : 'surveys'"
                         class="carousel-block mt-3"
                         :surveys="getAvailableSurveys"
                         :moved-items="3">
                    </div>
                </div>
            </div>

            <div class="profiles__item-2" v-else>
                <div class="projects-empty" v-lang.emptySurveys></div>
            </div>

            <div class="profiles__item-3">
                <div class="current-projects">
                    <div class="current-projects__col">
                        <div class="current-project" :class="{'current-project--disabled': !getAllSurveys.length}">
                            <div class="current-project__title" v-lang.totalSurveys></div>
                            <div class="current-project__num" v-text="getAllSurveys.length"></div>
                        </div>
                    </div>
                    <div class="current-projects__col">
                        <div class="current-project" :class="{'current-project--disabled': !getCompletedSurveys.length}">
                            <div class="current-project__title" v-lang.survey.completedSurveys></div>
                            <div class="current-project__num" v-text="getCompletedSurveys.length"></div>
                        </div>
                    </div>
                    <div class="current-projects__col">
                        <div class="current-project" :class="{'current-project--disabled': !relationsCount}">
                            <div class="current-project__title" v-lang.totalRelations></div>
                            <div class="current-project__num" v-text="relationsCount"></div>
                        </div>
                    </div>
                    <div class="current-projects__col hide">
                        <div class="current-project" :class="{'current-project--disabled': false}">
                            <div class="current-project__icon">
                                <img src="../../assets/img/networks-logo.svg" alt="networks" width="30" height="23">
                            </div>
                            <div class="current-project__title" v-lang.profiles></div>
                            <div class="current-project__num" v-text=""></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '../../mixins/utils';
    import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';

    export default {
        name: 'Networks',
        data() {
            return {
                statistics: {},
                recommendationsCount: 0
            }
        },
        components: {
            NetworksActions: () => import('./NetworksActions.vue'),
            SurveysCarousel: () => import('./SurveysCarousel.vue'),
            Surveys: () => import('./Surveys.vue')
        },
        mixins: [ mixin ],
        head: {
            title: function () {
                return {
                    inner: this.translate('networks')
                };
            }
        },
        created() {
            (async () => {
                this.fillSurveys({values: []});
                this.$store.commit('setFooterView', true);
                await this.getSurveys();  //TODO: statistics и recommendationsCount пока что захардкожены
                await this.getRelationsCount();
                await this.$store.dispatch('getUserStatistics');
                this.statistics = {
                    tests: 0
                };
                this.recommendationsCount = 2;
            })();
        },
        methods: {
            ...mapActions('survey', [
                'getSurveys',
                'getRelationsCount'
            ]),
            ...mapMutations('survey', [
                'fillSurveys'
            ])
        },
        computed: {
            getAvailableSurveys() {
                return this.getAllSurveys.filter(s => !s.visitedCompletedSurvey);
            },
            ...mapGetters('survey', [
                'getAllSurveys',
                'getCompletedSurveys'
            ]),
            ...mapState('survey', [
                'relationsCount'
            ])
        }
    }
</script>
