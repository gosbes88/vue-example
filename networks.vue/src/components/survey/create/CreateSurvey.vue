<template>
    <div class="container-default">
        <div class="container-small" :style="{ marginBottom: fixedFooter ? '80px' : 0 }">
            <div class="page-project-creation">
                <div class="text-center">
                    <h1 class="title-big-page mb-2" v-lang.survey.create></h1>
                    <div class="mb-6" v-lang.survey.description></div>
                </div>
            </div>

            <div class="create-survey-list">
                <div is="survey-item" :survey="null" @select="selectSurvey"></div>
                <div is="survey-item"
                    v-for="(survey, index) in getAllSurveyTemplates"
                    :key="index"
                    :survey="survey"
                    :relations="getSurveyTemplateRelations[survey.id]"
                    @select="selectSurvey"
                ></div>
            </div>

            <div :class="{ 'footer-wrap-fixed': fixedFooter, 'footer-fixed': fixedFooter }" ref="footerBlock">
                <div :class="{ 'survey-footer': !fixedFooter }">
                    <div class="survey-footer__item">
                        <router-link to="/m">
                            <button class="text-link button-link anim-hover-left">
                                <i class="anim anim-icon arrow-left-green-mini-icon"
                                   :style="{backgroundImage: 'url(' + leftGreenImg + ')'}"></i>
                                <span v-lang.survey.back></span>
                            </button>
                        </router-link>
                    </div>

                    <div class="survey-footer__item">
                        <next-step :is-selected="isSelected" :survey-selected="surveySelected">
                            <button class="text-link button-link anim-hover-right" :class="{ 'button-gray--disabled': !isSelected }">
                                <span v-lang.survey.next></span>
                                <i class="anim anim-icon"
                                   :class="{ 'arrow-right-gray-mini-icon': !isSelected, 'arrow-right-green-mini-icon': isSelected }"
                                   :style="{backgroundImage: 'url(' + setArrow + ')'}">
                                </i>
                            </button>
                        </next-step>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '../../../mixins/utils';
    import { mapGetters } from 'vuex';
    import rightGrayImg from '../../../assets/img/arrow-mini-right-gray-light.svg';
    import rightGreenImg from '../../../assets/img/arrow-mini-right-green.svg';
    import leftGreenImg from '../../../assets/img/arrow-mini-left-green.svg';

    export default {
        name: 'CreateSurvey',
        data() {
            return {
                isSelected: false,
                surveySelected: null,
                fixedFooter: false,
                rightGrayImg,
                rightGreenImg,
                leftGreenImg
            };
        },
        head: {
            title: function () {
                return {
                    inner: this.translate('survey.create')
                };
            }
        },
        mixins: [ mixin ],
        components: {
            SurveyItem: () => import('./SurveyItem.vue'),
            NextStep: () => import('./NextStep.vue')
        },
        methods: {
            selectSurvey(id, selected) {
                this.surveySelected = selected ? id : null;
                this.isSelected = !!this.surveySelected;
                if (this.isSelected) {
                    this.$children.forEach((child) => child.$emit('changeSelected', this.surveySelected));
                }
            },
            makeFixedFooter() {
                let footer = this.$refs.footerBlock;
                return window.innerHeight <= footer.offsetTop + footer.clientHeight;
            },
            async updateFooter() {
                await this.$store.dispatch('survey/getSurveyTemplates');
                await this.$nextTick(() => this.fixedFooter = this.makeFixedFooter());
                this.$store.commit('setFooterView', !this.fixedFooter);
            }
        },
        computed: {
            setArrow() {
                return this.isSelected ? this.rightGreenImg : this.rightGrayImg;
            },
            ...mapGetters('survey', [
                'getAllSurveyTemplates',
                'getSurveyTemplateRelations'
            ])
        },
        created() {
            this.isSelected = false;
        },
        mounted() {
            this.updateFooter();
        }
    };
</script>
