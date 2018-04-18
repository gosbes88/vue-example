<template>
    <div>
        <div class="dynamics-title js-dynamics-title" v-lang.employees.dynamics></div>

        <div v-if="getAvailableRatingsHistory.length">
            <indicator-filter class="search-employee filters-list-employees mt-2" style="width: 1039px;"
                              @update="updateFilters"
                              v-if="getAvailableRatingsHistory.length >= 3"
            ></indicator-filter>
            <div v-if="getRatings.length">
                <dynamics-graph v-for="(item, index) in getRatings" :index="index" :key="item.competence.id" :data="item" class="mt-2"></dynamics-graph>
            </div>
            <div v-else class="indicators__empty indicators__dynamics-empty" v-lang.employees.notFound></div>
        </div>
        <div v-else class="indicators__empty" ref="empty" v-lang.employees.indicatorsEmpty ></div>
    </div>
</template>

<script>
    import { mapGetters, mapActions, mapState } from 'vuex';
    import { Strings } from '../../../../utils/Strings';

    export default {
        data() {
            return {
                filter: "",
                selectedType: {
                    id: "ALL"
                }
            };
        },
        components: {
            IndicatorFilter: () => import('../IndicatorFilter.vue'),
            DynamicsGraph: () => import('./DynamicsGraph.vue')
        },
        watch: {
            competencies(val) {
                this.getRatingsHistory(this.getCompetenciesIds);
            }
        },
        created() {
            this.$bus.$on('windowResize', this.recalcHeight);
            if (this.getCompetenciesIds.length) {
                this.getRatingsHistory(this.getCompetenciesIds);
            }
        },
        mounted() {
            this.recalcHeight();
        },
        computed: {
            getRatings() {
                const type = this.selectedType.id;
                const indicators = type === 'ALL'
                    ? this.getAvailableRatingsHistory
                    : this.getAvailableRatingsHistory.filter(e => type === 'RATING' ? e.competence.type === 'RATING' : e.competence.type !== 'RATING');
                return Strings.isBlank(this.filter)
                    ? indicators
                    : indicators.filter(i => Strings.includesIgnoreCase(i.competence.name, this.filter));
            },
            ...mapGetters('employees', [
                'getCompetenciesIds',
                'getAvailableRatingsHistory'
            ]),
            ...mapState('employees', [
                'competencies'
            ])
        },
        methods: {
            recalcHeight() {
                if (!this.$refs.empty) {
                    return;
                }
                let elemPrint = document.querySelector('.js-print');
                let elemHeader = document.querySelector('.header-wrap');
                let title = document.querySelector('.js-dynamics-title');
                const mainBlockPadding = parseFloat(window.getComputedStyle(document.querySelector(".employee-main")).paddingTop);
                this.$refs.empty.style.height = `${window.innerHeight - elemHeader.offsetHeight - elemPrint.offsetHeight - mainBlockPadding - title.offsetHeight}px`;
            },
            updateFilters({filter, selectedType}) {
                this.filter = filter;
                this.selectedType = selectedType;
            },
            ...mapActions('employees', [
                'getRatingsHistory'
            ])
        },
        beforeDestroy() {
            this.$bus.$off('windowResize', this.recalcHeight);
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    .dynamics-title {
        font-size: 18px;
    }

    .indicators__empty {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indicators__dynamics-empty {
        height: ~'calc(100vh - 214px)';
        cursor: default;
    }
</style>