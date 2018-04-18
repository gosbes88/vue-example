<template>
    <div>
        <div v-if="empty"></div>
        <div class="js-container no-select">
            <breadcrumbs class="js-breadcrumbs"></breadcrumbs>

            <div class="container-default">

                <div class="stage-head-block js-stage-head-block">
                    <div class="stage-head-block__col-1">
                        <router-link class="btn-prev anim-hover-left" :to="{name: 'Participant'}">
                            <i class="btn-prev__icon anim anim-icon arrow-left-gray-icon" :style="{background: 'url(' + ArrowLeftGrayImg + ') no-repeat'}"></i>
                            <span class="btn-prev__text" v-lang.survey.surveysBack></span>
                        </router-link>
                    </div>

                    <div class="stage-head-block__col-2">
                        <h1 class="stage-head-block__title" v-text="getTitle"></h1>
                    </div>

                    <div class="stage-head-block__col-3">
                        <button @click="confirm" class="btn-next anim-hover-right">
                            <span class="btn-next__text" v-lang.survey.finish></span>
                            <i class="btn-next__icon anim anim-icon" :style="{background: 'url(' + ArrowRightGreenImg + ') no-repeat'}"></i>
                        </button>
                    </div>
                </div>

                <div class="select-employees">
                    <div class="select-employees__col-1 js-employees-list">
                        <div class="employees-rate-list">
                            <employee v-for="(employee, index) in getEmployeesWithoutUser(getSelectOrganization.employeeId).slice(0, 200)" :employee="employee" :key="index"></employee>
                        </div>
                        <div v-if="getEmployeesWithoutUser(getSelectOrganization.employeeId).length > MAX_VISIBLE_EMPLOYEES_COUNT"
                             v-lang.participants.first = "{count: MAX_VISIBLE_EMPLOYEES_COUNT}"
                             class="mt-2 mb-2 text-center"
                        ></div>
                    </div>

                    <div class="select-employees__col-2">

                        <div class="employees-selected-text js-employees-selected-text">
                            <span class="employees-selected-text__label" v-lang.survey.participantSelected></span>

                            <span class="employees-selected-text__value" v-text="getSelectedEmployees.length"></span>
                        </div>

                        <div class="employees-selected-list js-participants-list">
                            <selected-employee v-for="(employee, index) in getSelectedEmployees" :employee="employee" :key="index"></selected-employee>
                        </div>

                    </div>
                </div>

                <div class="task-panel js-task-panel">
                    <div class="task-panel__container">
                        <filters></filters>
                    </div>
                </div>

            </div>
            <confirmation-step-end :is-popup-viewed="showPopup"
                                   @close="hidePopup"
                                   @confirm="save"
            ></confirmation-step-end>
        </div>
    </div>
</template>

<script>
    import ArrowLeftGrayImg from '../../assets/img/arrow-left-dark-gray.svg';
    import ArrowRightGreenImg from '../../assets/img/arrow-mini-right-green.svg';
    import { mapActions, mapGetters, mapState } from 'vuex';
    import mixins from '../../mixins/utils';
    import { MAX_VISIBLE_EMPLOYEES_COUNT } from '../../utils/Constants';

    export default {
        data() {
            return {
                empty: true,
                ArrowLeftGrayImg,
                ArrowRightGreenImg,
                showPopup: false,
                MAX_VISIBLE_EMPLOYEES_COUNT
            };
        },
        head: {
            title() {
                return {
                    inner: this.survey.orElse([]).name || this.translate('survey.question')
                };
            }
        },
        mixins: [ mixins ],
        components: {
            Employee: () => import('./EmployeeInfo.vue'),
            Breadcrumbs: () => import('./Breadcrumbs.vue'),
            SelectedEmployee: () => import('./SelectedEmployee.vue'),
            Filters: () => import('./Filters.vue'),
            ConfirmationStepEnd: () => import('./ConfirmationStepEnd.vue')
        },
        created() {
            this.initialize();
        },
        updated() {
            let headerHeight = document.querySelector(".header-wrap").offsetHeight;
            let headHeight = document.querySelector(".js-stage-head-block").offsetHeight;
            let breadcrumbsHeight = document.querySelector(".js-breadcrumbs").offsetHeight;
            let footerHeight = document.querySelector(".js-task-panel").offsetHeight;

            let listEmployeesHeightValue = headerHeight + headHeight + breadcrumbsHeight + footerHeight + "px";
            let listEmployeesHeightTotal = `calc(100vh - ${listEmployeesHeightValue})`;

            let selectedEmployeesSize = window.getComputedStyle(document.querySelector(".js-employees-selected-text"));
            let selectedEmployees = parseFloat(selectedEmployeesSize.height) + parseFloat(selectedEmployeesSize.marginBottom);

            let selectedEmployeesHeightValue = headerHeight + headHeight + breadcrumbsHeight + footerHeight + selectedEmployees + "px";
            let selectedEmployeesHeightTotal = `calc(100vh - ${selectedEmployeesHeightValue})`;

            document.querySelector(".js-employees-list").style.height = listEmployeesHeightTotal; // вычисляем высоту списка участников
            document.querySelector(".js-participants-list").style.height = selectedEmployeesHeightTotal; // вычисляем высоту выбранных участников
        },
        methods: {
            async initialize() {
                this.empty = true;
                await this.getSurveyData();
                await this.getAnswer(this.getQuestionId());
                await this.getDepartments();
                await this.getPositions();
                /**
                 * К MAX_VISIBLE_EMPLOYEES_COUNT добавлено 2, чтобы исключить без ущерба числу самого проходящего сотрудника и узнать, что в организации больше 200 человек
                 * для указания информации проходящему о том, что не все сотрудники показаны
                 */
                await this.getEmployeesByFilters({filter: null, position: null, departmentId: null, employeeIds: [], limit: MAX_VISIBLE_EMPLOYEES_COUNT + 2, offset: null, includeDismissed: false});
                this.empty = false;
            },
            hidePopup() {
                this.showPopup = false;
            },
            confirm() {
                if (!this.getSelectedEmployees.length) {
                    this.showPopup = true;
                } else {
                    this.save();
                }
            },
            async save() {
                this.hidePopup();
                this.$bus.$emit("clear");
                await this.updateAnswer(this.getQuestionId());
                this.answers.length < this.surveyQuestions.length - 1
                        ? await this.initialize()
                        : this.$router.push({name: 'Result', params: {id: this.$route.params.id}});
            },
            getQuestionId() {
                return this.surveyQuestions[this.answers.length] ? this.surveyQuestions[this.answers.length].id : null;
            },
            ...mapActions('survey', [
                'getEmployeesByFilters',
                'getDepartments',
                'getPositions',
                'getSurveyData',
            ]),
            ...mapActions('participant', [
                'getAnswer',
                'updateAnswer'
            ])
        },
        computed: {
            getTitle() {
                return this.survey.orElse({}).questions && this.survey.orElse({}).questions.length && this.answers
                    ? this.survey.orElse({}).questions[this.answers.length].text
                    : "";
            },
            answers() {
                return this.participantAnswers(this.getSelectOrganization.employeeId);
            },
            ...mapGetters('participant', [
                'getSelectedEmployees'
            ]),
            ...mapGetters([
                'getSelectOrganization'
            ]),
            ...mapGetters('survey', [
                'getEmployeesWithoutUser',
                'surveyQuestions',
                'participantAnswers'
            ]),
            ...mapState('survey', [
                'survey'
            ])
        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .select-employees {
        &__col-1 {
            width: 860px;
        }
    }

    .task-panel {
        &__container {
            height: 100%;
        }
    }

    .text-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>