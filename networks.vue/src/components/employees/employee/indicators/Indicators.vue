<template>
    <div>
        <div class="indicators__empty" ref="empty" v-if="!competencies.orElse([]).length">
            <div class="competencies-indicators__title" v-lang.employees.indicatorsEmpty></div>
        </div>
        <div class="competencies-indicators" v-else>
            <nav class="indicator-nav">
                <a class="indicator-nav__item" :class="{'active': isTable}" href="javascript:void(0);" @click="isTable = true" v-lang.employees.table></a>
                <a class="indicator-nav__item" :class="{'active': !isTable}" href="javascript:void(0);" @click="isTable = false" v-lang.employees.diagrams></a>
            </nav>

            <div v-if="isTable">
                <indicator-filter class="search-employee filters-list-employees mt-2"
                                  :style="{'width': widthTable + 'px'}"
                                  v-if="(getAvailableIndicators(true).length + getAvailableIndicators(false).length) >= 10"
                                  @update="updateFilters"
                ></indicator-filter>

                <div class="competencies-indicators-table-scroll">
                    <table class="competencies-indicators-table">
                        <thead>
                            <tr>
                                <th class="competencies-indicators-table__title competencies-indicators-table__name" v-lang.employees.indicatorName></th>
                                <th class="competencies-indicators-table__title competencies-indicators-table__value" v-lang.employees.indicatorValue></th>
                                <th class="competencies-indicators-table__title competencies-indicators-table__avg-value" v-lang.employees.indicatorAvgValue></th>
                                <th class="competencies-indicators-table__title competencies-indicators-table__max-value" v-lang.employees.indicatorMaxValue></th>
                            </tr>
                        </thead>
                        <tbody v-if="existsIndicators">
                            <tr v-for="(item, index) in getAvailableIndicators()" :key="index">
                                <td class="competencies-indicators-table__cell competencies-indicators-table__name">
                                    <span class="competencies-indicators-table__name-text" v-text="item.indicator.name"></span>
                                </td>
                                <td class="competencies-indicators-table__cell competencies-indicators-table__value" :style="{'color': getColor(progress(item))}" v-text="item.value"></td>
                                <td class="competencies-indicators-table__cell competencies-indicators-table__avg-value" v-text="item.avgValue"></td>
                                <td class="competencies-indicators-table__cell competencies-indicators-table__max-value" v-text="getMaxValue(item.indicator)"></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td class="text-center indicators__table-empty" colspan="4" v-lang.employees.notFound></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="diagrams-content">
                <div class="diagrams-content__item">
                    <div class="indicator-item">
                        <div class="indicator-item__col">
                            <div class="indicator-item__icon">
                                <i class="pie-chart-icon" :style="{background: 'url(' + chartImg + ') no-repeat'}"></i>
                            </div>
                        </div>

                        <div class="indicator-item__col">
                            <div class="indicator-item__title" v-lang.employees.main></div>
                            <div class="indicator-item__list">
                                <div class="diagrams-list">
                                    <indicator-item class="diagrams-list__item" v-for="(item, index) in getAvailableIndicators(true)"
                                                    :key="index"
                                                    :id="'rating'"
                                                    :item="item"
                                                    :max-value="getMaxValue(item.indicator)"
                                    ></indicator-item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="diagrams-content__item">

                    <div class="indicator-item">
                        <div class="indicator-item__col">
                            <div class="indicator-item__icon">
                                <i class="pie-chart-icon" :style="{background: 'url(' + chartImg + ') no-repeat'}"></i>
                            </div>
                        </div>

                        <div class="indicator-item__col">
                            <div class="indicator-item__title" v-lang.employees.competence></div>
                            <div class="indicator-item__list">
                                <div class="diagrams-list">
                                    <indicator-item class="diagrams-list__item" v-for="(item, index) in getAvailableIndicators(false)"
                                                    :key="index"
                                                    :id="'competence'"
                                                    :item="item"
                                                    :max-value="getMaxValue(item.indicator)"
                                    ></indicator-item>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    import mixins from '../../../../mixins/utils';
    import indicatorMixins from '../../../../mixins/Indicators';
    import { Strings } from "../../../../utils/Strings";
    import { MAX_SCORE_INDICATOR, MAX_SCORE_COMPETENCE } from '../../../../utils/Constants';
    import chartImg from '../../../../assets/img/information-employee/pie-chart.svg';

    export default {
        data() {
            return {
                chartImg,
                filter: "",
                selectedType: {
                    id: 'ALL'
                },
                isTable: true,
                widthTable: 0,
                leftCor: 0
            };
        },
        components: {
            IndicatorFilter: () => import('../IndicatorFilter.vue'),
            IndicatorItem: () => import('../IndicatorItem.vue'),
        },
        mixins: [ mixins, indicatorMixins ],
        created() {
            this.$bus.$on('windowResize', this.recalcHeight);
            if (!this.isEmptyObject(this.employeeRating.orElse({}))) {
                this.getEmployeeRating();
            }
        },
        mounted() {
            this.recalcHeight();
            this.recalcWidth();
        },
        methods: {
            updateFilters({ filter, selectedType}) {
                this.filter = filter;
                this.selectedType = selectedType;
            },
            // scrollList(event) {
            //     // this.leftCor = document.querySelector('.diagrams-list__wrapper')
            //      let line = event.deltaY;
            //      let maxWidth = getComputedStyle(document.querySelector('.diagrams-list')).width;
            //     maxWidth = parseInt(maxWidth);
            //
            //
            //     this.leftCor = this.leftCor + line;
            //     if(leftCor < 0)
            //         leftCor = 0;
            //     if(leftCor > maxWidth)
            //         leftCor = maxWidth;
            //     return false;
            // },
            recalcHeight() {
                if (!this.$refs.empty) {
                    return;
                }
                let elemPrint = document.querySelector('.js-print');
                let elemHeader = document.querySelector('.header-wrap');
                const mainBlockPadding = parseFloat(window.getComputedStyle(document.querySelector(".employee-main")).paddingTop);
                this.$refs.empty.style.height = `${window.innerHeight - elemHeader.offsetHeight - elemPrint.offsetHeight - mainBlockPadding}px`;
            },
            recalcWidth() {
                this.widthTable = document.querySelector('.competencies-indicators-table').offsetWidth;
            },
            progress(item) {
                return item.value * 100 / this.getMaxValue(item.indicator);
            },
            getMaxValue(indicator) {
                return indicator.type === 'RATING' ? MAX_SCORE_INDICATOR : MAX_SCORE_COMPETENCE;
            },
            getAvailableIndicators(isRating = null) {
                const competencies = isRating === null
                        ? this.filteredIndicators
                        : this.competencies.orElse([]).filter(c => isRating ? c.type === 'RATING' : c.type !== 'RATING');
                let availableIds = {};
                this.getEmployeeIndicators.forEach(i => availableIds[i.competenceId] = i);
                return competencies
                        .filter(c => availableIds[c.id] && availableIds[c.id].value !== null)
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
                'getEmployeeRating'
            ])
        },
        computed: {
            isBigBlock() {
                return !this.getAvailableIndicators(true).length || !this.getAvailableIndicators(false).length;
            },
            existsIndicators() {
                return Strings.isBlank(this.filter) || this.filteredIndicators.length;
            },
            filteredIndicators() {
                const type = this.selectedType.id;
                const indicators = type === 'ALL'
                        ? this.competencies.orElse([])
                        : this.competencies.orElse([]).filter(c => type === 'RATING' ? c.type === 'RATING' : c.type !== 'RATING');
                return Strings.isBlank(this.filter)
                        ? indicators
                        : indicators.filter(i => Strings.includesIgnoreCase(i.name, this.filter));
            },
            ...mapState('employees', [
                'competencies',
                'employeeRating'
            ]),
            ...mapGetters('employees', [
                'getEmployeeIndicators'
            ])
        }
    };
</script>