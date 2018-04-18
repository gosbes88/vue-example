<template>
    <aside class="page-list-employees__aside">
        <div class="list-employees-aside">
            <div class="list-employees-aside__item">

                <div class="aside-toolbox">
                    <div class="aside-toolbox__item">
                        <div class="return-back">
                            <router-link class="return-back__link" :to="linkBack">
                                <i class="return-back__icon arrow-left-white-icon" :style="{background: 'url(' + ArrowLeftImg + ')'}"></i>
                            </router-link>
                        </div>
                    </div>


                    <div class="aside-toolbox__item">
                        <!--TODO: временно не реализован. При прикручивании предусмотреть, что для итогов по опросу и для страницы сотрудников может быть разный функционал-->
                        <div class="settings-tooltip" v-if="false">
                            <div class="settings-btn" @click="showSettings=!showSettings">
                                <i class="settings-icon" :style="{background: 'url(' + SettingsImg + ')'}"></i>
                            </div>

                            <transition name="slide-fade">
                                <div class="settings-tooltip__content" v-show="showSettings">
                                    <i class="settings-tooltip__arrow"></i>
                                    Контент настроек
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>

            <div class="list-employees-aside__item">
                <slot name="create"></slot>
            </div>

            <div class="list-employees-aside__item">
                <slot name="navigation"></slot>
            </div>

            <div class="list-employees-aside__item">
                <slot name="button"></slot>
            </div>
        </div>
    </aside>
</template>

<script>
    import SettingsImg from '../../assets/img/information-employee/settings.svg';
    import ArrowLeftImg from '../../assets/img/employees/arrow-left-white.svg';
    export default {
        data() {
            return {
                ArrowLeftImg,
                SettingsImg,
                showSettings: false,
            };
        },
        props: {
            linkBack: {
                type: [String, Object],
                required: true
            }
        }
    };
</script>