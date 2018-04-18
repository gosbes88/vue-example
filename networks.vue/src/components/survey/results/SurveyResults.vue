<template>
    <div class="result-page">
        <div class="result-page__col-aside js-aside">
            <aside-common :link-back="isFromAnalytics ? {name: 'TotalAnalytics'} : {name: 'Manager'}">
                <div class="result-relation" slot="navigation">
                    <div class="result-relation__title" v-lang.survey.type></div>
                    <div v-for="(item, index) in surveyRelationshipTypeWeights"
                       :class="{'result-relation__link--selected': selectedRelation && selectedRelation === item.id}"
                       class="result-relation__link"
                       v-text="item.relationshipType.name"
                       @click="selectRelation(item)"
                    ></div>
                </div>
            </aside-common>
        </div>

        <div class="result-page__col-2">
            <div class="result-content">
                <nav class="game-indicators-nav">
                    <a class="game-indicators-nav__link" :class="{'active': showDiagram}" href="javascript:void(0);" @click="showDiagram = true" v-lang.survey.diagram></a>
                    <a class="game-indicators-nav__link" :class="{'active': !showDiagram}" href="javascript:void(0);" @click="showDiagram = false" v-lang.survey.list></a>
                </nav>

                <total-information id="list-block-panel" class="tabpanel result-main"
                                   :show-diagram="showDiagram"
                                   :relation="selectedRelation"
                ></total-information>
            </div>
        </div>

        <div class="result-page__col-3">
            <employee-information :selected-relation="selectedRelation" class="result-card">
                <div slot="footer" class="survey-footer-results">
                    © {{ new Date().getFullYear() }} Valadorus
                </div>
            </employee-information>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapActions, mapGetters, mapState } from 'vuex';
    import { CENTRALITY_INDEX_ID } from '../../../utils/Constants';

    export default {
        data() {
            return {
                selectedRelation: null,
                showDiagram: true,
                isFromAnalytics: false
            };
        },
        components: {
            AsideCommon: () => import('../../common/Aside.vue'),
            TotalInformation: () => import('./TotalInformation.vue'),
            EmployeeInformation: () => import('./EmployeeDetailInformation.vue')
        },
        created() {
            this.$bus.$on('windowResize', this.headerMinWidth);
            (async () => {
                await this.getSurveyData();
                if (!this.survey.orElse({}).visitedCompletedSurvey && this.survey.orElse({}).statusType === 'COMPLETED') {
                    await this.changeSurveyVisitState({surveyId: this.survey.orElse({}).id});
                }
                await this.getAllEmployeesCentralityIndex({employeesIds: this.getParticipateEmployeesIds, competenciesIds: [CENTRALITY_INDEX_ID]});
                await this.getEmployeesRelationships({
                    employeesIds: this.getParticipateEmployeesIds,
                    relationshipTypeIds: this.surveyRelationshipTypeWeights.map(e => e.relationshipType.id)
                });
                await this.getDepartments();
                await this.getPositions();
            })();
        },
        mounted() {
            this.headerMinWidth();
        },
        beforeDestroy() {
            this.$bus.$off('windowResize', this.headerMinWidth);
            document.querySelector(".header-wrap").style.minWidth = null;
        },
        beforeRouteEnter(to, from, next) {
            next($this => $this.isFromAnalytics = from.name === "TotalAnalytics");
        },
        watch : {
            showDiagram(val) {
                if (val) {
                    this.getEmployeesRelationships({
                        employeesIds: this.getParticipateEmployeesIds,
                        relationshipTypeIds: this.selectedRelation || this.surveyRelationshipTypeWeights.map(e => e.relationshipType.id)
                    });
                }
            }
        },
        computed: {
            ...mapState('survey', [
                'survey'
            ]),
            ...mapGetters('survey', [
                'surveyRelationshipTypeWeights',
                'getParticipateEmployeesIds'
            ])
        },
        methods: {
            headerMinWidth() {
                let asideWidth = document.querySelector(".js-aside").offsetWidth;
                let listColumnWidth = document.querySelector(".result-page__col-2").offsetWidth;
                let resultColumnWidth = document.querySelector(".result-page__col-3").offsetWidth;
                document.querySelector(".header-wrap").style.minWidth = asideWidth + listColumnWidth + resultColumnWidth + "px";
            },
            selectRelation(relation) {
                this.selectedRelation = this.selectedRelation === relation.relationshipType.id ? null : relation.relationshipType.id;
                if (this.showDiagram) {
                    this.getEmployeesRelationships({
                        employeesIds: this.getParticipateEmployeesIds,
                        relationshipTypeIds: this.selectedRelation || this.surveyRelationshipTypeWeights.map(e => e.relationshipType.id)
                    });
                }
            },
            ...mapMutations([
                'setFooterView'
            ]),
            ...mapActions('survey', [
                'getSurveyData',
                'getAllEmployeesCentralityIndex',
                'getDepartments',
                'getPositions',
                'getEmployeesRelationships',
                'changeSurveyVisitState'
            ])
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .result-page {
        &__col-aside {
            flex: 0 0 auto;
        }

        &__col-2 {
            min-width: 797px;
        }

        &__col-3 {
            min-width: inherit;
        }
    }

    .result-card {
        height: 100%;

        &__wrap {
            display: flex;
            flex-direction: column;

            height: 100%;
            min-width: 567px;

            .tab-content {
                flex: 1 0 auto;
            }

            &--empty {
                flex-direction: column-reverse;
            }
        }
    }

    .page-list-employees {
        &__aside {
            height: 100%;
        }
    }
</style>