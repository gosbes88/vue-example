<template>
    <div v-show="isPopupViewed" class="flex-popup-wrap flex-popup-show">
        <div class="flex-popup" @click.self="closePopup">
            <div class="flex-popup__content popup-add-question">
                <i @click="closePopup" class="flex-popup__close">
                    &times;
                </i>

                <div class="flex-article">
                    <div class="flex-article__head">
                        <h3 class="popup-add-question__title" v-lang.employees.filterSave></h3>
                    </div>

                    <div class="flex-article__main">
                        <label>
                            <span v-lang.employees.filterName></span>
                            <input :placeholder="translate('employees.filterPlaceholder')" v-model="name" v-focus/>
                        </label>
                    </div>

                    <div class="flex-article__footer">
                        <a v-if="name.trim().length" @click="confirm" class="flex-article__footer-btn" href="javascript:void(0);" v-lang.save></a>
                        <a v-else class="flex-article__footer-btn disabled" href="javascript:void(0);" v-lang.save></a>
                        <a @click="closePopup" class="flex-article__footer-btn" href="javascript:void(0);" v-lang.cancel></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: ""
            };
        },
        props: {
            isPopupViewed: Boolean
        },
        methods: {
            closePopup() {
                this.name = "";
                this.$emit('close');
            },
            confirm() {
                this.$emit('save', this.name);
                this.name = "";
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .disabled {
        color: #ccc !important;
        pointer-events: none;
    }
</style>