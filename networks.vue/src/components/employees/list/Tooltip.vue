<template>
    <div class="tooltip-box" v-if="competencies.orElse([]).length" @click.stop="showTooltip">
        <i class="more-icon" :style="{background: 'url(' + MoreImg + ') no-repeat'}"></i>

        <transition name="tooltip">
            <div class="tooltip-box__content" v-if="showContent">
                <i class="tooltip-box__arrow-icon"></i>
                <div class="tooltip-box-list-wrap">
                    <input class="tooltip-box-list__inp" type="text" v-model="filter" :placeholder="translate('employees.competenceName')" @click.stop="() => {}" @keyup.enter="showTooltip"/>
                    <ul class="tooltip-box-list">
                        <li class="tooltip-box-list__item" v-for="(item, index) in getAvailableCompetencies" :key="index" v-text="item.name" @click="updateIndicators(item)"></li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import MoreImg from '../../../assets/img/employees/more.svg';
    import { Strings } from '../../../utils/Strings';
    import { mapState } from 'vuex';
    import { bus } from '../../../main';

    export default {
        props: {
            disabledIndicators: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                MoreImg,
                showContent: false,
                filter: ""
            }
        },
        created() {
            bus.$on("hide", data => this.showContent = data);
            document.addEventListener("click", this.hide.bind(this));
        },

        computed: {
            getAvailableCompetencies() {
                return this.competencies.orElse([]).filter(c => !this.disabledIndicators.includes(c.id) && (Strings.isBlank(this.filter) || Strings.includesIgnoreCase(c.name, this.filter)));
            },
            ...mapState('employees', [
                'competencies'
            ])
        },
        methods: {
            hide() {
                bus.$emit('hide', false);
            },
            showTooltip() {
                const oldValue = this.showContent;
                bus.$emit('hide', false);
                this.showContent = !oldValue;
            },
            updateIndicators(item) {
                this.$emit('updateIndicators', item);
                this.filter = "";
            }
        }
    };
</script>

<style>
    .tooltip-enter-active {
        transition: all .2s ease;
    }
    .tooltip-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .tooltip-enter, .tooltip-leave-to {
        transform: translateY(10px);
        opacity: 0;
    }
</style>
