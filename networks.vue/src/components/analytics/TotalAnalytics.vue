<template>
    <div class="analytics__wrapper">
        <div class="container-default">
            <div class="completed-project-head">
                <h1 class="completed-project-head__title title-big-page" v-lang.survey.analyticsTitle></h1>
            </div>

            <div class="completed-project-desc"></div>

            <div class="completed-project-search" v-if="showFilter || firstRun">
                <div class="completed-project-search__content" :style="{'opacity': Number(!firstRun)}">
                    <div class="completed-project-search__col-1">
                        <i class="completed-project-search__icon search-icon" :style="{'background': `url(${SearchImg}) no-repeat`}"></i>
                    </div>

                    <div class="completed-project-search__col-2">
                        <input class="completed-project-search__inp" type="search" :placeholder="translate('survey.analyticsSearch')" v-model="filter">
                    </div>

                    <div class="completed-project-search__col-3">
                        <div class="completed-project-search__find-completed" v-show="showCount">
                            <span class="completed-project-search__text" v-lang.survey.found></span>
                            <span class="completed-project-search__num" v-text="availableSurveys.length"></span>
                        </div>
                    </div>

                    <div class="completed-project-search__col-4">
                        <i class="completed-project-search__icon-close close-search-icon"
                           :class="{'completed-project-search__icon-close--show': filter.length}"
                           :style="{'background': `url(${CloseDarkImg}) no-repeat`}"
                           @click="clearFilter"
                        ></i>
                    </div>
                </div>
            </div>

            <div id="projects">
                <div v-if="availableSurveys.length">
                    <survey-block v-for="survey in availableSurveys" :key="survey.id" :survey="survey"></survey-block>
                </div>
                <div v-else class="container-small survey__empty" v-lang.survey.surveyNotFound></div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchImg from '../../assets/img/search.svg';
    import CloseDarkImg from '../../assets/img/close-dark.svg';
    import { mapActions, mapGetters, mapState } from 'vuex';
    import { Strings } from '../../utils/Strings';

    export default {
        data() {
            return {
                SearchImg,
                CloseDarkImg,
                showFilter: true,
                filter: "",
                timer: null,
                showCount: false,
                firstRun: true
            };
        },
        head: {
            title: function () {
                return {
                    inner: this.translate('survey.analyticsTitle')
                };
            }
        },
        components: {
            SurveyBlock: () => import('./SurveyBlock.vue'),
        },
        created() {
            (async () => {
                this.$store.commit('setFooterView', true);
                await this.getSurveys();
                this.showFilter = this.surveys.orElse([]).length > 5;
                await this.getEmployeesByFilters({employeeIds: Array.from(this.getParticipantsSurveysByEmployeeId.keys())});
            })();
        },
        updated() {
            this.firstRun = false;
        },
        watch: {
            filter(val) {
                this.showCount = Boolean(val);
            }
        },
        methods: {
            clearFilter() {
                this.filter = "";
            },
            filterHandle(survey) {
                if (!this.filter.trim()) {
                    return true;
                }

                const include = val => Strings.includesIgnoreCase(val, this.filter);
                const isParticipant = e => survey.participants.some(p => p.employeeId === e.id);

                return include(survey.name)
                        || survey.relationshipTypeWeights.some(rtw => include(rtw.relationshipType.name))
                        || this.employees.orElse([]).filter(isParticipant).some(e => include(e.lastName) || include(e.name || "") || include(e.email) || include(e.positionName || ""));
            },
            ...mapActions('survey', [
                'getSurveys',
                'getEmployeesByFilters'
            ])
        },
        computed: {
            availableSurveys() {
                return [...this.getCompletedSurveys, ...this.getActiveSurveys]
                        .filter(this.filterHandle)
                        .sort((a, b) => a.endDate < b.endDate);
            },
            ...mapGetters('survey', [
                'getCompletedSurveys',
                'getActiveSurveys',
                'getParticipantsSurveysByEmployeeId'
            ]),
            ...mapState('survey', [
                'surveys',
                'employees'
            ])
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .survey__empty {
        display: flex;
        justify-content: center;
        align-items: center;
        height: ~'calc(100vh - 282px)';  //TODO: Вострецов - возможно следует настроить высоту
    }

    .analytics__wrapper {
        overflow-x: hidden;
        overflow-y: auto;
        height: ~'calc(100vh - 100px)';
    }
</style>