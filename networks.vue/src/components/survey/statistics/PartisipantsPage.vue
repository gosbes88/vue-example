<template>
    <div>
        <div class="container-block">
            <div class="selection-participants-head">
                <router-link class="selection-participants-head__link link-back anim-hover-left" :to="{name: 'SurveyNew', params: {id: $route.params.id}}">
                    <i class="link-back__icon arrow-left-mini-icon anim anim-icon" :style="{'background': 'url(' + ArrowImg + ') no-repeat'}"></i>
                    <span v-lang.back></span>
                </router-link>

                <h1 class="selection-participants-head__title" style="margin: 0 auto;" v-lang.survey.participants3></h1>

                <router-link v-if="survey.orElse({}).statusType === 'ACTIVE'" v-lang.survey.addParticipants :to="{name: 'Participants', params: {id : $route.params.id}}"></router-link>
            </div>
        </div>

        <div class="container-block">
            <div class="selection-participants-main">
                <section class="selection-participants-main__col-full">
                    <filters @updateFilters="updateFilters"></filters>
                    <participant-table :filters="filters"></participant-table>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import ArrowImg from '../../../assets/img/arrow-mini-left.svg';
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
    import { EMPLOYEES_LIMIT } from '../../../utils/Constants';

    export default {
        data() {
            return {
                ArrowImg,
                filters: {}
            };
        },
        head: {
            title: function () {
                return {
                    inner: this.survey.orElse({}).name || ""
                }
            }
        },
        components: {
            ParticipantTable: () => import('./ParticipantsTable.vue'),
            Filters: () => import('./Filters.vue')
        },
        created() {
            let root = this;
            (async () => {
                root.fillEmployees({values: null});
                await root.getSurveyData();
                await root.getDepartmentsByEmployees();
                await root.getPositionsByEmployees();
                await root.getEmployeesByFilters({filter: null, position: null, departmentId: null, employeeIds: root.getParticipateEmployeesIds, limit: EMPLOYEES_LIMIT, includeDismissed: false});
            })();
        },
        computed: {
            ...mapState('survey', [
                'survey'
            ]),
            ...mapGetters('survey', [
                'getParticipateEmployeesIds'
            ])
        },
        methods: {
            updateFilters(filters) {
                this.filters = filters;
            },
            ...mapActions('survey', [
                'getSurveyData',
                'getDepartmentsByEmployees',
                'getPositionsByEmployees',
                'getEmployeesByFilters'
            ]),
            ...mapMutations('survey', [
                'fillEmployees'
            ])
        }
    };
</script>