<template>
    <th class="list-employees-table__title">
        <div v-if="!isEmptyObject(indicator)" class="employees-head-title">
            <div class="employees-head-title__item" v-text="indicator.name" @click="updateSortOrder"></div>
            <div class="employees-head-title__item" :class="{'not-visible': !(getSortColumn === index && getSortOrder)}" @click="updateSortOrder">
                <i class="employees-head-title__icon sort-icon" :style="{background: 'url(' + SortImg + ') no-repeat'}" :class="{'reverse': getSortOrder === 'ASC'}"></i>
            </div>
            <div class="employees-head-title__item">
                <tooltip :disabled-indicators="getIndicators" @updateIndicators="updateIndicators($event, index - 1)"></tooltip>
            </div>
        </div>
        <div v-else class="employees-head-title">
            <div class="employees-head-title__item" v-lang.employees.name @click="updateSortOrder"></div>
            <div class="employees-head-title__item" :class="{'not-visible': !(getSortColumn === index && getSortOrder)}" @click="updateSortOrder">
                <i class="employees-head-title__icon sort-icon" :style="{background: 'url(' + SortImg + ') no-repeat'}" :class="{'reverse': getSortOrder === 'ASC'}"></i>
            </div>
        </div>
    </th>
</template>

<style lang="less" rel="stylesheet/less">
    .not-visible {
        visibility: hidden;
    }
</style>

<script>
    import SortImg from '../../../assets/img/employees/sort.svg';
    import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
    import { EMPLOYEES_LIMIT } from '../../../utils/Constants';
    import mixins from '../../../mixins/utils';

    export default {
        props: {
            indicator: {
                type: Object,
                default: () => { return {}; }
            },
            index: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                SortImg,
                newSortType: {
                    'ASC': 'DESC',
                    'DESC': 'ASC'
                }
            };
        },
        components: {
            tooltip: () => import('./Tooltip.vue')
        },
        computed: {
            ...mapState('employees', [
                'currentFilter'
            ]),
            ...mapGetters('employees', [
                'getSortColumn',
                'getIndicators',
                'getSortOrder'
            ])
        },
        mixins: [ mixins ],
        methods: {
            async updateIndicators(indicator, index) {
                let indicators = this.getIndicators.map((value, key) => key === index ? indicator.id : value);
                this.updateCurrentFilter({field: 'competenciesIds', value: indicators});
                this.updateCurrentFilter({field: 'offset', value: 0});
                this.$emit('changeOffset');
                this.$bus.$emit('changeLoadBlock', false);
                await this.getEmployeesRatings({...this.currentFilter.orElse({}), limit: EMPLOYEES_LIMIT});
                this.$bus.$emit('changeLoadBlock', true);
            },
            updateSortOrder() {
                let sortType = this.getSortColumn !== this.index
                        ? 'ASC'
                        : this.newSortType[this.getSortOrder];
                this.updateCurrentFilter({field: 'sortOrder', value: sortType});
                this.updateCurrentFilter({field: 'sortColumn', value: sortType ? this.index : 0});
                this.$emit('changeOffset');
                this.$bus.$emit('changeLoadBlock', false);
                this.getEmployeesRatings({...this.currentFilter.orElse({}), limit: EMPLOYEES_LIMIT, offset: 0});
                this.$bus.$emit('changeLoadBlock', true);
            },
            ...mapMutations('employees', [
                'updateCurrentFilter'
            ]),
            ...mapActions('employees', [
                'getEmployeesRatings'
            ])
        }
    };
</script>