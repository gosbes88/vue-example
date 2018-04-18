<template>
    <div class="select-wrapper">
        <div class="select" :class="classSelectedElementWrapper" @click.stop="showTooltip">
            <div class="select__item" @click="clickedSelected">
                <div class="select__current" :class="classSelectedCurrent" v-text="selectedElement.name"></div>
            </div>

            <div class="select__item">
                <i class="select__icon" :class="{'select__icon--rotate': show}" :style="{background: 'url(' + arrowImg + ') no-repeat'}"></i>
            </div>
        </div>

        <transition name="slide-fade">
            <div v-show="show" class="select-list" :class="classElementsWrapper">
                <ul class="select-list__content">
                    <li class="select-list__item" v-if="existsTextValue" :class="classElement" v-text="defaultText"  @click.stop="selectElement(defaultText)"></li>
                    <li class="select-list__item" :class="classElement" v-for="element in elements" v-text="element.name" @click.stop="selectElement(element.id)"></li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
    import arrowImg from '../../assets/img/arrow-bottom-green.svg';
    import { bus } from '../../main';
    /**
     * element : { id, name}
     * Обязательно наличие
     */
    export default {
        data() {
            return {
                show: false,
                arrowImg
            };
        },
        props: {
            selectedCanClicked: {
                type: Boolean,
                default: false
            },
            elements: {
                type: Array,
                default: () => []
            },
            selectedElement: {
                type: Object,
                default: () => {return {};}
            },
            defaultText: {
                type: String,
                default: ""
            },
            classElement: {
                type: String,
                default: ""
            },
            classSelectedCurrent: {
                type: String,
                default: ""
            },
            classElementsWrapper: {
                type: String,
                default: ""
            },
            classSelectedElementWrapper: {
                type: String,
                default: ""
            }
        },
        created() {
            bus.$on("hide", data => this.show = data);
            document.addEventListener("click", this.hide.bind(this));
        },
        beforeDestroy() {
            document.removeEventListener("click", this.hide.bind(this));
        },
        computed: {
            existsTextValue() {
                return this.defaultText.trim().length > 0;
            }
        },
        methods: {
            clickedSelected(event) {
                if (!this.selectedCanClicked) {
                    return;
                }
                event.stopPropagation();
                this.selectElement(this.selectedElement.id);
            },
            selectElement(id) {
                this.show = false;
                if (this.selectedCanClicked || id !== this.selectedElement.id) {
                    let element = this.elements.filter(item => item.id === id)[0] || {id: this.defaultText, name: this.defaultText};
                    this.$emit('selectElement', element);
                }
            },
            showTooltip() {
                const oldValue = this.show;
                bus.$emit('hide', false);
                this.show = !oldValue;
            },
            hide() {
                bus.$emit('hide', false);
            }
        }
    };
</script>

<style lang="less">
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .01s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateY(10px);
        opacity: 0;
    }
</style>