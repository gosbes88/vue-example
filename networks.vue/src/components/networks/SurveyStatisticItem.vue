<template>
    <div class="slider-block__item">
        <router-link class="project-content" :to="getLink(item)" tag="div">
            <div class="project-content__graph">
                <vue-circle class="project-content__circle" :style="progressPosition"
                            :progress="getProgress"
                            :size="118"
                            :reverse="false"
                            line-cap="round"
                            :fill="{color: '#8ccb4b'}"
                            empty-fill="transparent"
                            :animation="false"
                            :start-angle="completedPercent | getStartAngle"
                            :thickness="4"
                            :show-percent="false"
                            insert-mode="append"
                >
                </vue-circle>
                <div class="statistics-circle statistics-circle-done">
                    <div class="project-content__url"></div>
                    <div class="statistics-circle__container">
                        <div class="statistics-circle__content">
                            <div v-if="item.statusType === 'COMPLETED'">
                                <div class="statistics-circle__done-icon done-icon" :style="{background: 'url(' + doneImg + ') no-repeat'}"></div>
                                <div class="statistics-circle__done" v-lang.completed2></div>
                            </div>
                            <div v-else-if="item.statusType === 'ACTIVE'">
                                <div class="statistics-circle__title" v-lang.fulfilled></div>
                                <div class="statistics-circle__num" v-text="completedPercent + '%'"></div>
                            </div>
                            <div v-else-if="item.statusType === 'NEW' && item.startDate">
                                <div class="project-start-date">
                                    <div class="project-start-date__title" v-lang.begin></div>

                                    <div class="project-start-date__day" v-text="getDateNumber(item.startDate)"></div>

                                    <div class="project-start-date__month" v-text="getMonthName(item.startDate)"></div>
                                </div>
                            </div>
                            <div v-else>
                                <span style="color: #999;" v-lang.New></span>
                            </div>
                        </div>
                    </div>
                    <div class="statistics-circle__line z-1"></div>
                </div>
                <doughnut-chart
                        class="doughnut-chart"
                        :style="chartPosition"
                        :width="136"
                        :height="136"
                        :options="optionsChart"
                        :data="getChartData">
                </doughnut-chart>
            </div>

            <h3 class="project-content__title-max" v-once :title="getSummary(item.name)" v-text="getSummary(item.name)"></h3>
            <div class="project-content__date" v-once v-text="getDate(item)"></div>
        </router-link>
    </div>
</template>

<script>
    import DoughnutChart from "../../mixins/DoughnutChart";
    import VueCircle from 'vue2-circle-progress';
    import doneImg from '../../assets/img/done.svg';
    import mixins from '../../mixins/utils';

    export default {
        props: {
            item: {
                type: Object,
                default: () => {return {};}
            },
            progressPosition: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            chartPosition: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        data() {
            return {
                optionsChart: {
                    responsive: false,
                    maintainAspectRatio: false,
                    animation: false,
                    legend: {
                        display: false
                    },
                    cutoutPercentage: 91
                },
                doneImg
            };
        },
        mixins: [ mixins ],
        components: {
            DoughnutChart,
            VueCircle
        },
        computed: {
            getProgress() {
                return this.item.statusType === 'COMPLETED' ? 100 : this.completedPercent;
            },
            getChartData() {
                return {
                    labels: [
                        this.translate('notStarted'), this.translate('active'), this.translate('completed1')
                    ],
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
                            data: this.item.statusType === 'NEW'
                                    ? [0, 0, 0]
                                    : [this.notStartedSize, this.inProgressSize, this.completedSize]
                        }
                    ]
                };
            },
            completedSize() {
                return this.item.participants.filter(p => p.answers.length === this.item.questions.length).length;
            },
            notStartedSize() {
                return this.item.participants.filter(p => !p.answers.length).length;
            },
            inProgressSize() {
                return this.item.participants.filter(p => p.answers.length && p.answers.length < this.item.questions.length).length;
            },
            completedPercent() {
                return this.item.questions.length
                        ? parseInt(this.completedSize / this.item.participants.length * 100)
                        : 0;
            }
        },
        methods: {
            getLink(item) {
                switch (item.statusType) {
                    case 'COMPLETED':
                        return {name: 'SurveyResults', params: {id: item.id}};
                    case 'ACTIVE':
                        return {name: 'SurveyNew', params: {id: item.id}};
                    default:
                        return {name: item.lastStage || 'SurveyNew', params: {id: item.id}};
                }
            },
            getMonthName(startDate) {
                return this.translate(`month.${(new Date(startDate)).getMonth()}`);
            },
            getDateNumber(startDate) {
                return (new Date(startDate)).getDate();
            },
            getDate(interview) {
                if (interview.startDate && interview.endDate) {
                    let textStart = (new Date(interview.startDate)).getMonth() === (new Date(interview.endDate)).getMonth()
                        ? this.getDateNumber(interview.startDate)
                        : `${this.getDateNumber(interview.startDate)} ${this.getMonthName(interview.startDate)}`;

                    let textEnd = `${this.getDateNumber(interview.endDate)} ${this.getMonthName(interview.endDate)}`;

                    return `${textStart} - ${textEnd}`;
                }
                return null;
            },
            getSummary(summary) {
                return Boolean(summary) && Boolean(summary.trim()) ? summary : this.translate('noName');
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .z-1 {
        z-index: 1;
    }
</style>