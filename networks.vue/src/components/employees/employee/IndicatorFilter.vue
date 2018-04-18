<template>
    <div>
        <div class="search-employee__col-1">
            <div class="search-employee__col-wrap">
                <i class="search-employee__icon search-icon" :style="{background: 'url(' + searchIconImg + ') no-repeat'}"></i>
                <input class="search-employee__inp" type="search" :placeholder="translate('employees.searchByName')" v-model="filter">
                <i class="search-close-icon close-light-icon"
                   :class="{'search-close-icon--show': filter.length > 0 }"
                   :style="{background: 'url(' + closePopupIcon + ') no-repeat'}"
                   @click="clearFilter">
                </i>
            </div>
        </div>
        <div class="search-employee__col-2">
            <div class="search-employee__col-wrap">
                <select-component class="search-employee__select"
                                  :class="{ 'select-wrapper--font-small': selectedTypeLength }"
                                  :elements="types"
                                  :selectedElement="selectedType"
                                  @selectElement="selectType"
                ></select-component>
            </div>
        </div>
    </div>
</template>

<script>
    import searchIconImg from '../../../assets/img/search.svg';
    import closePopupIcon from '../../../assets/img/cross.svg';

    export default {
        data() {
            return {
                searchIconImg,
                closePopupIcon,
                filter: "",
                selectedType: {},
                types: []
            };
        },
        components: {
            SelectComponent: () => import('../../common/Select.vue')
        },
        watch: {
            filter(val) {
                this.update();
            }
        },
        created() {
            this.types = [
                {name: this.translate('employees.allTypes'), id: 'ALL'},
                {name: this.translate('employees.competenceType'), id: 'COMPETENCE'},
                {name: this.translate('employees.indicatorType'), id: 'RATING'}
            ];
            this.selectedType = {name: this.translate('employees.allTypes'), id: 'ALL'};
        },
        computed: {
            selectedTypeLength() {
                return this.selectedType.name.length > 17;
            }
        },
        methods: {
            selectType(element) {
                if (element.id !== this.selectedType.id) {
                    this.selectedType = element;
                    this.update();
                }
            },
            clearFilter() {
                this.filter = "";
            },
            update() {
                this.$emit('update', {filter: this.filter, selectedType: this.selectedType});
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less">

</style>