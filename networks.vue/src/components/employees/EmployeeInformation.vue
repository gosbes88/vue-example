<template>
    <div class="info-employee no-select">
        <div class="info-employee__col-1">
            <aside class="employee-aside">
                <div class="employee-aside__item">
                    <div class="data-employee">
                        <div class="data-employee__col-1">
                            <router-link :to="{name: 'Employees'}" tag="div" class="back-link">
                                <i class="arrow-left-icon" :style="{background: 'url(' + arrowLeftImg + ') no-repeat'}"></i>
                            </router-link>
                        </div>

                        <div class="data-employee__col-2">
                            <div class="data-employee__content">
                                <div class="data-employee__row-1">
                                    <div class="data-employee__title" v-lang.employees.totalScore></div>
                                    <div class="data-employee__num" v-text="score"></div>
                                </div>
                                <div class="data-employee__row-2">
                                    <div class="avatar js-avatar">
                                        <vue-circle class="" style="position: absolute; top: 2px; left: 2px;"
                                                    :progress="progress"
                                                    :size="120"
                                                    :reverse="false"
                                                    line-cap="round"
                                                    :fill="{color: '#8ccb4b'}"
                                                    empty-fill="transparent"
                                                    :animation="false"
                                                    :start-angle="score | getStartAngle"
                                                    :thickness="4"
                                                    :show-percent="false"
                                                    insert-mode="append"
                                        >
                                        </vue-circle>
                                        <img class="avatar__img" :src="getAvatar" :alt="employeeInfo">
                                    </div>
                                </div>
                                <div class="data-employee__row-3">
                                    <div class="data-employee__fullname" v-text="employeeInfo"></div>
                                    <div class="data-employee__profession" v-text="position"></div>
                                </div>
                            </div>
                        </div>

                        <div class="data-employee__col-3">
                            <div class="settings-tooltip" v-if="false">
                                <div class="settings-btn" @click="showSettings = !showSettings">
                                    <i class="settings-icon" :style="{background: 'url(' + settingsImg + ') no-repeat'}"></i>
                                </div>
                                <transition name="slide-fade">
                                    <div class="settings-tooltip__content" v-show="showSettings">
                                        <i class="settings-tooltip__arrow"></i>
                                        Контент настроек
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="employee-aside__item js-navs">
                    <nav class="nav-employee">
                        <div class="nav-employee__item">
                            <router-link class="nav-employee__link" :to="{name: 'SummaryInformation'}" exact-active-class="nav-employee__link--cur">
                                <span class="nav-employee__icon info-icon" :style="{background: 'url(' + infoImg + ') no-repeat'}"></span>
                                <span class="nav-employee__title" v-lang.employees.summaryInformation></span>
                            </router-link>
                        </div>

                        <div class="nav-employee__item">
                            <router-link class="nav-employee__link" :to="{name: 'Indicators'}" exact-active-class="nav-employee__link--cur">
                                <span class="nav-employee__icon graph-icon" :style="{background: 'url(' + graphImg + ') no-repeat'}"></span>
                                <span class="nav-employee__title" v-lang.employees.competencies></span>
                            </router-link>
                        </div>

                        <div class="nav-employee__item">
                            <router-link class="nav-employee__link" :to="{name: 'StructureAndRelations'}" exact-active-class="nav-employee__link--cur">
                                <span class="nav-employee__icon share-icon" :style="{background: 'url(' + shareImg + ') no-repeat'}"></span>
                                <span class="nav-employee__title" v-lang.employees.structure></span>
                            </router-link>
                        </div>

                        <div class="nav-employee__item">
                            <router-link class="nav-employee__link" :to="{name: 'Dynamics'}" exact-active-class="nav-employee__link--cur">
                                <span class="nav-employee__icon diagram-icon" :style="{background: 'url(' + diagramImg + ') no-repeat'}"></span>
                                <span class="nav-employee__title" v-lang.employees.dynamics></span>
                            </router-link>
                        </div>

                        <div class="nav-employee__item">
                            <router-link class="nav-employee__link" :to="{name: 'Description'}" exact-active-class="nav-employee__link--cur">
                                <span class="nav-employee__icon message-icon" :style="{background: 'url(' + messageImg + ') no-repeat'}"></span>
                                <span class="nav-employee__title" v-lang.employees.description></span>
                            </router-link>
                        </div>

                        <div class="nav-employee__item">
                            <router-link class="nav-employee__link" :to="{name: 'ComparativeAnalysis'}" exact-active-class="nav-employee__link--cur">
                                <span class="nav-employee__icon data-pie-chart-icon" :style="{background: 'url(' + dataImg + ') no-repeat'}"></span>
                                <span class="nav-employee__title" v-lang.employees.comparative></span>
                            </router-link>
                        </div>
                    </nav>
                </div>

            </aside>
        </div>

        <div class="info-employee__col-2">
            <div class="employee-main">
                <div class="employee-main__item-1 js-print">
                    <div class="panel-btns">
                        <a class="btn-round" href="javascript:void(0);">
                            <i class="btn-round__icon print-icon" :style="{background: 'url(' + printImg + ') no-repeat'}"></i>
                        </a>
                    </div>
                </div>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    import avatarImg from '../../assets/img/avatar-default.png';
    import infoImg from '../../assets/img/information-employee/info.svg';
    import graphImg from '../../assets/img/information-employee/graph.svg';
    import shareImg from '../../assets/img/information-employee/share.svg';
    import dataImg from '../../assets/img/information-employee/data-pie-chart.svg';
    import diagramImg from '../../assets/img/information-employee/diagram.svg';
    import messageImg from '../../assets/img/information-employee/message.svg';
    import arrowLeftImg from '../../assets/img/information-employee/arrow-left.svg';
    import printImg from '../../assets/img/information-employee/print.svg';
    import settingsImg from '../../assets/img/information-employee/settings.svg';
    import { MAX_SCORE_COMPETENCE as maxScore } from '../../utils/Constants';
    import { bus } from '../../main';

    export default {
        data() {
            return {
                showSettings: false,
                imageDefault: avatarImg,
                infoImg,
                graphImg,
                shareImg,
                dataImg,
                diagramImg,
                messageImg,
                arrowLeftImg,
                printImg,
                settingsImg
            };
        },
        components: {
            VueCircle: () => import('vue2-circle-progress')
        },
        methods: {
            recalcNavHeight() {
                let elemDataEmployee = document.querySelector('.data-employee');
                let elemHeader = document.querySelector('.header-wrap');
                document.querySelector('.js-navs').style.height = `${window.innerHeight - elemHeader.offsetHeight - elemDataEmployee.offsetHeight}px`;
            },
            ...mapActions('employees', [
                'getCompetencies',
                'getEmployeeRating',
                'getEmployeeRelationships'
            ])
        },
        filters: {
            getStartAngle(employeeScore) {
                const onePercent = Math.PI / 50;
                const percentCompleted = (employeeScore * 100) / maxScore;
                return Math.PI / 2 - parseFloat(onePercent * percentCompleted / 2);
            }
        },
        computed: {
            progress() {
                return parseFloat(this.score * 100 / maxScore);
            },
            score() {
                return this.employeeRating.orElse({}).totalScore || 1000;
            },
            getAvatar() {
                return this.getEmployee && this.getEmployee.avatar
                    ? `/organizations/img/employee/${this.getEmployee.id}/avatar`
                    : this.imageDefault;
            },
            employeeInfo() {
                return this.getEmployee ? `${this.getEmployee.lastName || ''} ${this.getEmployee.firstName || ''}` : '';
            },
            position() {
                return this.getEmployee ? this.getEmployee.position || '' : '';
            },
            ...mapState('employees', [
                'employeeRating'
            ]),
            ...mapGetters('employees', [
                'getEmployee'
            ])
        },
        created() {
            bus.$on('windowResize', this.recalcNavHeight);
            (async () => {
                await this.getCompetencies();
                await this.getEmployeeRating();
                await this.getEmployeeRelationships({employeeId: this.$route.params.id});
            })();
        },
        beforeDestroy() {
            bus.$off('windowResize', this.recalcNavHeight);
        },
        updated() {
            this.recalcNavHeight();
        }
    };
</script>

<style lang="less">
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateY(10px);
        opacity: 0;
    }
</style>