<template>
    <div id="app" class="page-section" @click="isModulesViewed = false">
        <div class="header-wrap header-org-wrap"  v-if="$store.state.errorPage">
            <error-page-header></error-page-header>
        </div>
        <div class="header-wrap header-org-wrap" v-else>
            <header class="header">
                <div class="header__item">
                    <div class="header-change">
                        <div class="header-change__item">
                            <router-link :to='mainLink' class="logo-link js-remove-storage">
                                <img class="logo-link__img" src="./assets/img/networks-logo.svg">
                                <span class="logo-link__title" v-lang.networks></span>
                            </router-link>
                        </div>

                        <div class="header-change__item">
                            <div class="switching-modules">
                                <i class="switching-modules__icon change-account-icon"
                                   @click.stop="isModulesViewed = !isModulesViewed"
                                   :style="{'background': 'url(' + switchModule + ') no-repeat'}">
                                </i>

                                <div class="switching-modules__content" :class="{'switching-modules__content-show': isModulesViewed }">
                                    <div class="switching-modules__item">
                                        <a class="switching-modules__link" href="/assessment">
                                            <div class="switching-modules__row">
                                                <div class="switching-modules__logo">
                                                    <img class="switching-modules__img" src="./assets/img/assessment-logo.svg">
                                                </div>
                                                <div class="switching-modules__group">
                                                    <div class="switching-modules__title" v-lang.assessment></div>
                                                    <div class="switching-modules__info" v-lang.assessmentInfo></div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>

                                    <div class="switching-modules__item hide">
                                        <div class="switching-modules__row">
                                            <a class="switching-modules__link" href="/kpi">
                                                <div class="switching-modules__logo">
                                                    <img class="switching-modules__img" src="./assets/img/kpi-logo.svg">
                                                </div>
                                                <div class="switching-modules__group">
                                                    <div class="switching-modules__title" v-lang.kpi></div>
                                                    <div class="switching-modules__info" v-lang.kpiInfo></div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>

                                    <div class="switching-modules__item switching-modules__line block-disabled">
                                        <div class="switching-modules__row">
                                            <a class="switching-modules__link" href="javascript:void(0);">
                                                <div class="switching-modules__logo">
                                                    <img class="switching-modules__img" src="./assets/img/networks-logo.svg">
                                                </div>
                                                <div class="switching-modules__group">
                                                    <div class="switching-modules__title" v-lang.networks></div>
                                                    <div class="switching-modules__info" v-lang.networksInfo></div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>

                                    <div class="switching-modules__item switching-modules__line">
                                        <div class="switching-modules__row">
                                            <a class="switching-modules__link" :href="organizationUrl">
                                                <div class="switching-modules__logo">
                                                    <img v-if="getSelectOrganization.hasLogo" class="switching-modules__img" :src="logo">
                                                    <img class="switching-modules__img" src="./assets/img/logo-valadorus.svg" v-else>
                                                </div>
                                                <div class="switching-modules__group">
                                                    <div class="switching-modules__title" v-text="organizationTitle"></div>
                                                    <div class="switching-modules__info" v-text="organizationInfo"></div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="header__item">
                    <div class="auth">
                        <div class="auth__item">
                            <span class="auth__username ml-2 link-text--color" v-text="getUserName"></span>

                            <div class="change-organization" v-if="getOrganizations.length > 1">
                                <span class="change-organization__dash">-</span>
                                <organization-select :selected-element="{ id: getSelectOrganization.organizationId, name: getSelectOrganization.organizationName }"
                                        :elements="getOrganizations"
                                        @selectElement="changeOrganization">
                                </organization-select>
                            </div>
                        </div>

                        <div class="auth__item" v-if="isSwitchShowed">
                            <a href="javascript: void(0);" v-text="switchTo" @click.prevent="changeRole"></a>
                        </div>

                        <div class="auth__item">
                            <a class="auth__exit" href="/as/logout" v-lang.exit></a>
                        </div>
                    </div>
                </div>
            </header>
        </div>
        <main class="main-wrap">
            <router-view></router-view>
        </main>
        <div class="footer-wrap" :class="{'footer-wrap-bg': $store.state.filledFooter}" v-show="$store.state.showFooter">
            <footer class="footer">
                <div class="footer__item">
                    <div class="footer__copy" v-text="getFooterContent"></div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { jeratixVersionInfo } from './utils/VersionInfo';
    import Image from './assets/img/change-account.svg';
    import faviconPng from './assets/img/favicon/favicon-networks.png';
    import favicon57 from './assets/img/favicon/favicon-networks-57.png';
    import favicon72 from './assets/img/favicon/favicon-networks-72.png';
    import favicon76 from './assets/img/favicon/favicon-networks-76.png';
    import favicon114 from './assets/img/favicon/favicon-networks-114.png';
    import favicon120 from './assets/img/favicon/favicon-networks-120.png';
    import favicon144 from './assets/img/favicon/favicon-networks-144.png';
    import favicon152 from './assets/img/favicon/favicon-networks-152.png';
    import favicon180 from './assets/img/favicon/favicon-networks-180.png';
    import faviconSvg from './assets/img/favicon/favicon.svg';

    export default {
        name: 'app',
        data () {
            return {
                logo:  '/organizations/img/organization/logo',
                revisionContent: null,
                isModulesViewed: false,
                switchModule: Image,
                faviconPng,
                favicon57,
                favicon72,
                favicon76,
                favicon114,
                favicon120,
                favicon144,
                favicon152,
                favicon180,
                faviconSvg,
                languageTypes: {
                    'ru-RU': 'ru',
                    'undefined': 'ru',
                    'default': 'en'
                }
            };
        },
        components: {
            OrganizationSelect: () => import('./components/common/Select.vue'),
            ErrorPageHeader: () => import('./components/common/ErrorPageHeader.vue')
        },
        head: {
            meta () {
                return [
                    {"charset": 'utf-8', undo: false},
                    {"http-equiv": "X-UA-Compatible", "content": "IE=edge", undo: false},
                    {"name": "description", "content": "Home page", undo: false},
                    {"name": "viewport", "content": "width=1000", undo: false},
                    {"name": "revision", "content": jeratixVersionInfo, undo: false}
                ];
            },
            link () {
                return [
                    {"rel": "apple-touch-icon", "type": "image/png", "href": this.faviconPng, undo: false},
                    {"rel": "apple-touch-icon", "sizes": "57x57", "href": this.favicon57, undo: false},
                    {"rel": "apple-touch-icon", "sizes": "72x72", "href": this.favicon72, undo: false},
                    {"rel": "apple-touch-icon", "sizes": "76x76", "href": this.favicon76, undo: false},
                    {"rel": "apple-touch-icon", "sizes": "114x114", "href": this.favicon114, undo: false},
                    {"rel": "apple-touch-icon", "sizes": "120x120", "href": this.favicon120, undo: false},
                    {"rel": "apple-touch-icon", "sizes": "144x144", "href": this.favicon144, undo: false},
                    {"rel": "apple-touch-icon", "sizes": "152x152", "href": this.favicon152, undo: false},
                    {"rel": "apple-touch-icon", "sizes": "180x180", "href": this.favicon180, undo: false},
                    {"rel": "icon", "type": "image/png", "href": this.faviconPng, undo: false},
                    {"rel": "icon", "type": "image/svg+xml", "href": this.faviconSvg, undo: false}
                ];
            }
        },
        created () {
            window.addEventListener('resize', this.notifyChildResize.bind(this));
            document.addEventListener('click', this.notifyChildClick.bind(this));
            (async () => {
                try {
                    await this.$store.dispatch('getUserData');
                    this.language = this.languageTypes[this.getSelectOrganization.locale] || this.languageTypes['default'];
                    if (location.pathname.endsWith("/networks") || location.pathname.endsWith("/networks/")) {
                        this.hasManager
                                ? this.$router.push("/m")
                                : this.hasUser
                                        ? this.$router.push("/p")
                                        : this.$router.push("/404");
                    }
                } catch (e) {
                    console.error(e);
                }
            })();
        },
        methods: {
            notifyChildResize() {
                this.$bus.$emit('windowResize');
            },
            notifyChildClick() {
                this.$bus.$emit('documentClick');
            },
            changeOrganization(organization) {
                this.$store.dispatch('changeOrganization', organization.id);
            },
            changeRole() {
                /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? this.$router.push({name: "Participant"}) : this.$router.push({name: "Manager"});
            }
        },
        computed: {
            mainLink() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? {name: "Manager"} : {name: "Participant"};
            },
            organizationTitle() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? this.translate('organizations') : this.translate('accountUser');
            },
            organizationInfo() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? this.translate('organizationsInfo') : this.translate('accountUserInfo');
            },
            organizationUrl() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? "/organizations" : "/organizations/account/user";
            },
            isSwitchShowed() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) && this.hasUser || /^(\/p)$|^(\/p\/)/.test(this.$route.fullPath) && this.hasManager;
            },
            switchTo() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? this.translate('participant') : this.translate('manager');
            },
            getOrganizations() {
                const existsOrganizations = this.$store.getters.getOrganizations;

                let organizations = [];
                for (let key in existsOrganizations) {
                    organizations.push({
                        id: existsOrganizations[key].organizationId,
                        name: existsOrganizations[key].organizationName
                    });
                }

                return organizations;
            },
            getFooterContent() {
                return `© ${(new Date()).getFullYear()} Valadorus`;
            },
            ...mapGetters([
                'getUserName',
                'getSelectOrganization',
                'hasUser',
                'hasManager'
            ])
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "main.less";
    @import "assets/_networks.less";
</style>
