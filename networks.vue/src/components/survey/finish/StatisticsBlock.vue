<template>
    <div class="statistics-block statistics-block--ind">
        <div class="statistics-block__col">
            <div class="hint z-2">
                <div class="statistics-block__help-icon help-icon">?</div>
                <div class="statistics-block__hint hint__content">
                    <div class="hint__arrow-bottom"></div>
                    <span v-lang.survey.completedTooltip></span>
                </div>
            </div>

            <div class="statistics-circle statistics-circle-done">
                <vue-circle class="statistics-circle__progress z-1"
                        :progress="completedPercent"
                        :size="116"
                        :reverse="false"
                        line-cap="round"
                        :fill="progressColor"
                        empty-fill="transparent"
                        :animation="false"
                        :start-angle="completedPercent | getStartAngle"
                        :thickness="4"
                        :show-percent="false"
                        insert-mode="append"
                ></vue-circle>
                <div class="statistics-circle__container">
                    <div class="statistics-circle__content">
                        <div class="statistics-circle__title" v-lang.fulfilled></div>
                        <div class="statistics-circle__num" v-text="completedPercent + '%'"></div>
                    </div>
                </div>
                <div class="statistics-circle__line"></div>
            </div>
        </div>

        <div class="statistics-block__col">
            <div class="statistics-circle statistics-circle--ind pull-left statistics-results">
                <div class="statistics-results__row">
                    <span class="statistics-results__title" v-text="translate('notStarted') + ':'"></span>
                    <span class="statistics-results__num statistics-results__num-not-started" v-text="notStartedSize"></span>
                </div>

                <div class="statistics-results__row">
                    <span class="statistics-results__title" v-text="translate('active') + ':'"></span>
                    <span class="statistics-results__num statistics-results__num-carry" v-text="participantsInProgress"></span>
                </div>

                <div class="statistics-results__row">
                    <span class="statistics-results__title" v-text="translate('completed1') + ':'"></span>
                    <span class="statistics-results__num statistics-results__num-completed" v-text="participantsCompleted"></span>
                </div>
            </div>

            <doughnut-chart class="statistics-chart"
                            :width="116"
                            :height="116"
                            :options="optionsChart"
                            :data="getChartData"
            ></doughnut-chart>
        </div>

    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import VueCircle from 'vue2-circle-progress';
    import DoughnutChart from "../../../mixins/DoughnutChart";
    import mixins from '../../../mixins/utils';
    import indicators from '../../../mixins/Indicators';

    export default {
        data() {
            return {
                optionsChart: {
                    responsive: false,
                    maintainAspectRatio: false,
                    animation: false,
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    cutoutPercentage: 91
                }
            };
        },
        mixins: [ mixins, indicators ],
        components: {
            VueCircle,
            DoughnutChart
        },
        computed: {
            getChartData() {
                return {
                    datasets: [
                        {
                            borderColor: 'white',
                            borderWidth: 0,
                            backgroundColor: [
                                "#b95455",
                                "#feae3b",
                                "#8ccb4b"
                            ],
                            hoverBackgroundColor: [
                                "#b95455",
                                "#feae3b",
                                "#8ccb4b"
                            ],
                            data: [
                                this.notStartedSize,
                                this.inProgressSize,
                                this.completedSize
                            ]
                        }
                    ]
                };
            },
            participantsInProgress() {
                return this.survey.orElse({}).statusType ==='ACTIVE' ? this.inProgressSize : 0;
            },
            participantsCompleted() {
                return this.survey.orElse({}).statusType === 'ACTIVE'
                    ? this.completedSize
                    : this.completedSize + this.inProgressSize;
            },
            progressColor() {
                return { color: this.getColor(this.completedPercent)};
            },
            ...mapState('survey', [
                'survey'
            ]),
            ...mapGetters('survey', [
                'completedSize',
                'notStartedSize',
                'inProgressSize',
                'completedPercent'
            ])
        }
    };
</script>