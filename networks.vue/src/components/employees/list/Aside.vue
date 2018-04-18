<template>
    <aside-common :link-back="{name: 'Manager'}">
        <div slot="create">
            <div class="new-name" @click="createNewFilter" v-lang.employees.addFilter></div>
            <div v-if="!showBlockSave"></div>
            <div v-else>
                <div v-if="currentFilter.orElse({}).id">
                    <div v-if="!editedFilters[currentFilter.orElse({}).id]" v-text="currentFilter.orElse({}).name"></div>
                    <div class="nav-list-employees__edit" v-else>
                        <a class="nav-list-employees__del-icon delete-icon" href="javascript:void(0);"
                           @click="cancelUpdate"
                           :style="{background: 'url(' + DeleteImg + ')'}"
                        ></a>
                        <input class="new-name__inp" :placeholder="translate('employees.newName')" @click.stop="" v-model="name"/>
                    </div>
                    <a v-show="!editedFilters[currentFilter.orElse({}).id]" class="nav-list-employees__icon  edit-btn-icon" href="javascript:void(0);"
                       :style="{background: 'url(' + PencilImg + ')'}"
                       @click.stop="editFilter(currentFilter.orElse({}))"
                    ></a>
                </div>
                <div v-else>
                    <input class="new-name__inp new-name__inp--full-width" :placeholder="translate('employees.newName')" v-model="name" />
                </div>
                <button v-if="!showAvailableActions" @click="selectionHandle({id: 'SAVE_AS'})">Save as</button>
                <drop-down v-else
                           :selected-element="actions[0]"
                           :elements = "actions"
                           :selected-can-clicked="true"
                           @selectElement="selectionHandle"
                ></drop-down>
            </div>
        </div>
        <div slot="navigation">
            <nav class="nav-list-employees">
                <ul class="nav-list-employees__wrap">
                    <li class="nav-list-employees__item" v-for="(item, index) in filters.orElse([])" :key="item.id" @click="selectFilter(item)">
                        <div class="nav-list-employees__row" :class="{'link--cur': currentFilter.orElse({}).id === item.id}">
                            <a class="nav-list-employees__link pl-1" href="javascript:void(0);" v-text="item.name" :title="item.name"></a>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
        <div slot="button">
            <confirm-popup :is-popup-viewed="isPopupViewed" @close="isPopupViewed = false" @save="saveNewFilter"></confirm-popup>
        </div>
    </aside-common>
</template>

<script>
    import DeleteImg from '../../../assets/img/employees/delete.svg';
    import PencilImg from '../../../assets/img/employees/pencil-edit.svg';
    import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
    import { EMPLOYEES_LIMIT } from '../../../utils/Constants';

    export default {
        data() {
            return {
                editedFilters: {},
                showAvailableActions: false,
                isPopupViewed: false,
                DeleteImg,
                PencilImg,
                actions: [],
                showBlockSave: false
            }
        },
        components: {
            AsideCommon: () => import('../../common/Aside.vue'),
            DropDown: () => import('../../common/Select.vue'),
            ConfirmPopup: () => import('./ConfirmSave.vue')
        },
        created() {
            this.actions = [
                {
                    id: 'SAVE_AS',
                    name: this.translate('saveAs')
                },
                {
                    id: 'SAVE',
                    name: this.translate('save')
                },
                {
                    id: 'DISCARD',
                    name: this.translate('discard')
                }
            ];
        },
        watch: {
            currentFilter(val) {
                this.showAvailableActions = val.orElse({}).id
                        ? !this.equalsFilters(this.getFilterById(val.orElse({}).id), val.orElse({}))
                        : false;
            }
        },
        methods: {
            equalsFilters(filter1, filter2) {
                const filterLength = filter => filter.limit ? Object.keys(filter).length - 1 : Object.keys(filter).length;
                return filterLength(filter1) === filterLength(filter2)
                        && Object.keys(filter1).every(key => filter2[key] !== undefined
                                && (Array.isArray(filter1[key]) && Array.isArray(filter2[key])
                                        ? filter1[key].length === filter2[key].length && JSON.stringify(filter1[key]) === JSON.stringify(filter2[key])
                                        : filter1[key] === filter2[key])
                        );
            },
            selectionHandle(selectAction) {
                switch (selectAction.id) {
                    case "SAVE":
                        this.update();
                        break;
                    case "SAVE_AS":
                        if (!this.name.trim()) {
                            this.isPopupViewed = true;
                        } else {
                            this.updateCurrentFilter({field: 'id', value: null});
                            this.update();
                        }
                        break;
                    case "DISCARD":
                        (async () => {
                            this.fillCurrentFilter({value:  this.getFilterById(this.currentFilter.orElse({}).id)});
                            await this.update();
                            await this.getEmployeesRatings(this.currentFilter.orElse({}));
                        })();
                        break;
                }
            },
            selectFilter(filter) {
                this.editedFilters = {};
                if (filter.id === this.currentFilter.orElse({}).id) {
                    return;
                }
                this.fillCurrentFilter({value: JSON.parse(JSON.stringify(filter))});
                this.showBlockSave = true;
                this.updateCurrentFilter({field: 'limit', value: EMPLOYEES_LIMIT});
                this.$bus.$emit("updateRatings");
            },
            createNewFilter() {
                this.showBlockSave = true;
                //TODO: в дальнейшем будут выбираться 4 самые популярные
                let competenciesIds = this.competencies.orElse([]).slice(0, 4).map(c => c.id);
                this.fillCurrentFilter({ value: {
                    id: null,
                    name: "",
                    competenciesIds,
                    sortColumn: 0,
                    position: "",
                    departmentId: null,
                    sortOrder: "ASC",
                    filter: "",
                    limit: EMPLOYEES_LIMIT
                }});
                this.getEmployeesRatings(this.currentFilter.orElse({}));
            },
            saveNewFilter(name) {
                this.name = name;
                this.updateCurrentFilter({field: 'id', value: null});
                this.isPopupViewed = false;
                this.update();
            },
            editFilter(filter) {
                this.editedFilters = {};
                this.editedFilters[filter.id] = true;
            },
            cancelUpdate() {
                this.editedFilters = {};
                this.name = this.getFilterById(this.currentFilter.orElse({}).id).name;
            },
            async update() {
                this.editedFilters = {};
                await this.updateFilter();
                this.showAvailableActions = false;
            },
            ...mapActions('employees', [
                'updateFilter',
                'getEmployeesRatings'
            ]),
            ...mapMutations('employees', [
                'fillCurrentFilter',
                'updateCurrentFilter'
            ])
        },
        computed: {
            name: {
                get(){
                    return this.currentFilter.orElse({}).name;
                },
                set(value) {
                    this.updateCurrentFilter({field: 'name', value});
                }
            },
            canSave() {
                return this.name && this.name.trim().length > 0;
            },
            ...mapState('employees', [
                'filters',
                'currentFilter',
                'competencies'
            ]),
            ...mapGetters('employees', [
                'getFilterById'
            ])
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
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

    .save-disabled {
        filter: grayscale(100%);
        cursor: not-allowed;
    }

    .link--cur {
        position: relative;
        background: #414141;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: -3px;
            width: 5px;
            height: 45%;
            margin: auto;
            border-radius: 8px;
            background: #74ad39;
        }
    }

    .pl-1 {
        padding-left: 10px;
    }

    .nav-list-employees__row {
        &:hover {
            background: #414141;
            border-radius: 10px;
        }
    }
</style>