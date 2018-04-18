<template>
    <div class="employee-main__group">
        <div class="employee-main__item-2" v-if="getAvailableIndicators(true).length > 0">
            <div class="key-indicators">
                <div class="key-indicators__col-1">
                    <div class="key-indicators__title-icon">
                        <i class="pie-chart-icon" :style="{background: 'url(' + chartImg + ') no-repeat'}"></i>
                    </div>
                </div>

                <div class="key-indicators__col-2">
                    <div class="key-indicators__title" v-lang.employees.main></div>
                    <list-indicators :show="getAvailableIndicators(true).length > 4" :id="'rating'">
                        <indicator-item v-for="(item, index) in getAvailableIndicators(true)"
                                        :key="index"
                                        :id="'rating'"
                                        :item="item"
                                        :max-value="MAX_SCORE_INDICATOR"
                        ></indicator-item>
                    </list-indicators>
                </div>
            </div>
        </div>

        <!-- Компетенция -->
        <div class="employee-main__item-3" v-if="getAvailableIndicators(false).length > 0">
            <div class="competence-container">
                <div class="competence-container__col-1">
                    <div class="competence-container__title-icon">
                        <i class="pie-chart-icon" :style="{background: 'url(' + chartImg + ') no-repeat'}"></i>
                    </div>
                </div>

                <div class="competence-container__col-2">
                    <div class="competence-container__title" v-lang.employees.competence></div>
                    <list-indicators :show="getAvailableIndicators(false).length > 4" :id="'competence'">
                        <indicator-item v-for="(item, index) in getAvailableIndicators(false)"
                                        :key="index"
                                        :id="'competence'"
                                        :item="item"
                                        :max-value="MAX_SCORE_COMPETENCE"
                        ></indicator-item>
                    </list-indicators>
                </div>
            </div>
        </div>

        <!-- Структурные данные -->
        <div class="employee-main__item-4" v-if="getAvailableIndicators(true).length > 0">
            <div class="structural-data">
                <div class="structural-data__col-1">
                    <div class="structural-data__title-icon">
                        <i class="diagram-icon" :style="{background: 'url(' + diagramImg + ') no-repeat'}"></i>
                    </div>
                </div>

                <div class="structural-data__col-2">
                    <div class="environment__title" v-lang.employees.structuralData></div>

                    <list-indicators :show="getAvailableIndicators(true).length > 4" :id="'structuralData'">
                        <structural-data-item v-for="(item, index) in getAvailableIndicators(true)"
                                              :key="index"
                                              :id="'structuralData'"
                                              :item="item"
                                              :max-value="MAX_SCORE_COMPETENCE"
                        ></structural-data-item>
                    </list-indicators>
                </div>
            </div>
        </div>

        <div class="employee-main__item-5" v-show="employeeRelationships.orElse([]).length">
            <div class="environment">
                <div class="environment__col-1">
                    <div class="environment__title-icon">
                        <i class="share-icon" :style="{background: 'url(' + shareImg + ') no-repeat'}"></i>
                    </div>
                </div>

                <div class="environment__col-2">
                    <div class="environment__title" v-lang.employees.environment></div>
                    <environment></environment>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import chartImg from '../../../../assets/img/information-employee/pie-chart.svg';
    import diagramImg from '../../../../assets/img/information-employee/diagram.svg';
    import shareImg from '../../../../assets/img/information-employee/share.svg';
    import { mapGetters, mapState, mapActions } from 'vuex';
    import { MAX_SCORE_INDICATOR, MAX_SCORE_COMPETENCE } from '../../../../utils/Constants';

    export default {
        data() {
            return {
                chartImg,
                diagramImg,
                shareImg,
                MAX_SCORE_INDICATOR,
                MAX_SCORE_COMPETENCE
            };
        },
        components: {
            ListIndicators: () => import('./ListIndicators.vue'),
            IndicatorItem: () => import('../IndicatorItem.vue'),
            StructuralDataItem: () => import('./StructuralDataItem.vue'),
            Environment: () => import('./Environment.vue')
        },
        created() {
            if (this.employeeRelationships.orElse([]).length) {
                this.getEmployeeRelationships({employeeId: this.$route.params.id});
            }
        },
        computed: {
            ...mapGetters('employees', [
                'getEmployeeIndicators'
            ]),
            ...mapState('employees', [
                'competencies',
                'employeeRelationships'
            ])
        },
        methods: {
            getAvailableIndicators(isRating) {
                let availableIds = {};
                this.getEmployeeIndicators.forEach(i => availableIds[i.competenceId] = i);
                return this.competencies.orElse([])
                    .filter(c => availableIds[c.id] && availableIds[c.id].value !== null && (isRating ? c.type === 'RATING' : c.type !== 'RATING'))
                    .map(c => {
                        const avgValue = availableIds[c.id].avgValue !== null ? parseFloat(availableIds[c.id].avgValue.toFixed(2)) : null;
                        return {
                            value: parseFloat(availableIds[c.id].value.toFixed(2)),
                            avgValue,
                            indicator: c
                        };
                    });
            },
            ...mapActions('employees', [
                'getEmployeeRelationships'
            ])
        }
    };
</script>