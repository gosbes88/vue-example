<template>
    <div class="filter-head">
        <search class="filter-head__item" :show-total-reset="false" @updateFilters="updateEmployeeFilters"></search>

        <div class="filter-head__item">
            <div class="sort-ratings">
                <i class="sort-ratings__icon sort-ratings-icon"
                   :style="{background: 'url(' + SortImg + ') no-repeat'}"
                   :class="{'sort-ratings__icon--rotate': currentSort === 'indexLow'}"
                ></i>
                <sort :class="{ 'select-wrapper--font-small': selectedSortLength }"
                      :elements="sortElements"
                      :selectedElement="selectedElement"
                      @selectElement="selectSortType"
                ></sort>
            </div>
        </div>
    </div>
</template>

<script>
    import SortImg from '../../../assets/img/sort-rating.svg';
    import mixins from '../../../mixins/utils';

    export default {
        data() {
            return {
                SortImg,
                currentSort: 'name',
                sortType: new Map(),
                sortTypeShort: new Map(),
                filters: {}
            };
        },
        components: {
            Search: () => import('../participants/SearchBlock.vue'),
            Sort: () => import('../../common/Select.vue')
        },
        mixins: [ mixins ],
        created() {
            this.sortType
                    .set('indexHigh', `${this.translate('survey.index')} ${this.translate('survey.high')}`)
                    .set('indexLow', `${this.translate('survey.index')} ${this.translate('survey.low')}`)
                    .set('name', this.translate('survey.name'))
                    .set('department', this.translate('survey.department'));
            this.sortTypeShort
                    .set('indexHigh', this.translate('survey.index'))
                    .set('indexLow', this.translate('survey.index'))
                    .set('name', this.translate('survey.name'))
                    .set('department', this.translate('survey.department'));
        },
        computed: {
            sortElements() {
                let elements = [];
                this.sortType.forEach((value, key) => {
                    elements.push({
                        id: key,
                        name: value
                    });
                });
                return elements;
            },
            selectedElement() {
                return {
                    id: this.currentSort,
                    name: this.sortTypeShort.get(this.currentSort)
                };
            },
            selectedSortLength() {
                return this.sortTypeShort.get(this.currentSort).length > 8;
            }
        },
        methods: {
            selectSortType(value) {
                if (this.currentSort === value.id) {
                    return;
                }
                this.currentSort = value.id;
                this.update();
            },
            updateEmployeeFilters(filters) {
                this.filters = filters || this.filters;
                this.update();
            },
            update() {
                this.$emit('updateFilters', {...this.filters, sort: this.currentSort});
            }
        }
    };
</script>