<template>
    <div v-show="isPopupViewed" class="flex-popup-wrap flex-popup-show">
        <div class="flex-popup" @click.self="closePopup">
            <div class="flex-popup__content popup-add-question">
                <i @click="closePopup" class="flex-popup__close cursor-pointer">
                    &times;
                </i>

                <div class="flex-article">
                    <div class="flex-article__main mt-2" v-lang.participants.confirm></div>

                    <div class="flex-article__footer no-shadow">
                        <a @click="confirm" class="flex-article__footer-btn mr-3" href="javascript:void(0);" v-lang.yes></a>
                        <a @click="closePopup" class="flex-article__footer-btn" href="javascript:void(0);" v-lang.no></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            isPopupViewed: Boolean
        },
        methods: {
            closePopup() {
                this.$emit('close');
            },
            confirm() {
                this.$emit("confirm");
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .no-shadow {
        box-shadow: none !important;
    }

    .cursor-pointer {
        cursor: pointer;
    }
</style>