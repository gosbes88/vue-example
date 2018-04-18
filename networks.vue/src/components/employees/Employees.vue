<template>
    <div class="page-list-employees" :class="{'default': isScrollViewed, 'big': !isScrollViewed}">
        <aside-block></aside-block>
        <employees-info @updateWidth="updateWidth" :show-empty="showEmpty"></employees-info>
    </div>
</template>

<script>
    import { mapActions, mapMutations, mapState } from 'vuex';
    import { EMPLOYEES_LIMIT } from '../../utils/Constants';

    export default {
        data() {
            return {
                defaultHeight: "calc(100vh-51px)",
                isScrollViewed: true,
                showEmpty: false
            };
        },
        head: {
            title() {
                return {
                    inner: this.translate('employeesData')
                };
            }
        },
        components: {
            AsideBlock: () => import('./list/Aside.vue'),
            EmployeesInfo: () => import('./list/EmployeesInfo.vue')
        },
        created() {
            (async () => {
                await Promise.all([this.getDepartments(), this.getPositions(), this.getFilters(), this.getCompetencies()]);
                this.$bus.$emit('changeLoadBlock', false);
                //TODO: в дальнейшем будут выбираться 4 самые популярные
                let competencies = this.competencies.orElse([]).slice(0, 4).map(c => c.id);
                this.updateCurrentFilter({field: 'competenciesIds', value: competencies});
                this.updateCurrentFilter({field: 'sortColumn', value: 0});
                await this.getEmployeesRatings({competenciesIds: competencies, sortColumn: 0, limit: EMPLOYEES_LIMIT});
                this.$bus.$emit('changeLoadBlock', true);
                this.showEmpty = true;
            })();
        },
        methods: {
            updateWidth(show) {
                this.isScrollViewed = show;
            },
            ...mapActions('employees', [
                'getCompetencies',
                'getEmployeesRatings',
                'getFilters',
                'getDepartments',
                'getPositions'
            ]),
            ...mapMutations('employees', [
                'updateCurrentFilter',
                'clearState'
            ])
        },
        computed: {
            ...mapState('employees', [
                'competencies'
            ])
        },
        beforeRouteLeave(to, from, next) {
            this.clearState();
            next();
        }
    };
</script>