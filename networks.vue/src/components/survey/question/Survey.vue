<template>
    <div>
        <div>
            <div class="container-default">
                <div class="questions">
                    <div class="questions__item-1">
                        <div class="questions-main">
                            <div class="questions-main__item-1 js-title-height">
                                <h2 class="questions__title" v-lang.survey.selectQuestions></h2>
                            </div>

                            <div class="questions-main__item-2 js-subtitle-height">
                                <a class="add-question" href="javascript:void(0);" @click="showPopup" v-lang.survey.addQuestion></a>
                            </div>

                            <div class="questions-main__item-3 js-search-height">
                                <div class="search-question">
                                    <div class="search-question__col-1">
                                        <i class="search-question__icon search-icon" :style="{background: 'url(' + searchIconImg + ') no-repeat'}"></i>
                                        <input class="search-question__inp" type="search" :placeholder="translate('survey.search')" v-model="filter">
                                        <i class="search-close-icon close-light-icon"
                                           :class="{'search-close-icon--show': filter.length > 0}"
                                           :style="{background: 'url(' + closePopupIcon + ') no-repeat'}"
                                           @click="clearFilter"></i>
                                    </div>

                                    <div class="search-question__col-2">
                                        <link-type-select class="search-question__select"
                                                          :class="{ 'select-wrapper--font-small': selectCurrentLength }"
                                                          :elements="relationshipTypes.orElse([])"
                                                          :default-text="translate('survey.allTypes')"
                                                          :selected-element="selectedLink"
                                                          @selectElement="updateLinkType">
                                        </link-type-select>
                                    </div>
                                </div>
                            </div>

                            <div class="questions-main__item-4">
                                <div class="questions-list js-questions-list">
                                    <div v-if="sectionLeft.length > 0">
                                        <question-item class="questions-list__item"
                                                       v-for="(question, index) in sectionLeft"
                                                       :key="index"
                                                       :question="question"
                                                       @add="addQuestion">
                                        </question-item>
                                    </div>

                                    <div class="questions-list__not-found" v-else-if="filter.trim().length > 0" v-lang.survey.notFound></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="questions__item-2">
                        <aside class="questions-aside">
                            <div class="questions-aside__item-1 js-inp">
                                <input class="questions-aside__inp-new" type="text"
                                       :placeholder="translate('survey.addSummary')"
                                       v-model="surveyName"
                                       ref="name"
                                       v-focus>

                                <transition name="slide-fade">
                                    <div class="questions-aside__tooltip" v-show="showTooltip">
                                        <i class="questions-aside__arrow"></i>
                                        <span v-lang.survey.lengthTooltipMessage></span>
                                    </div>
                                </transition>
                            </div>

                            <div class="questions-aside__item-2">

                                <div class="js-types-relationships" :class="{'types-relationships': sectionRight.length > 0}">
                                    <div v-if="sectionRight.length > 0">
                                        <div class="types-relationships__title" v-lang.survey.typeLinks></div>

                                        <div class="types-relationships__content">
                                            <div class="types-relationships__item" v-for="item in surveyRelationshipTypeWeights" :key="item.id">
                                                <div class="types-relationships__num" v-text="`${item.weight}%`"></div>
                                                <div class="types-relationships__subtitle" v-text="item.relationshipType.name"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="questions-aside__item-3">
                                <div class="management-list-questions js-management-list-questions">
                                    <draggable v-model="sectionRight" :options="{group:'question'}" @start="drag=true" @end="drag=false">
                                        <added-question-item class="management-list-questions__item" style="padding: 10px;"
                                                             v-for="(question, index) in sectionRight"
                                                             @updateQuestion="updateQuestion"
                                                             @removeQuestion="removeQuestion"
                                                             @duplicateQuestion="duplicateAddedQuestion({oldId: $event, newId: generateUUID()})"
                                                             :question="question"
                                                             :index="index + 1"
                                                             :key="question.id">
                                        </added-question-item>
                                    </draggable>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div class="questions__item-3 js-footer-height">
                        <div class="questions-footer">
                            <div class="questions-footer__item">
                                <router-link class="anim-hover-left questions-footer__link" :to="{name: 'CreateSurvey'}">
                                    <i class="anim anim-icon arrow-left-green-mini-icon" :style="{backgroundImage: 'url(' + leftGreenImg + ')'}"></i>
                                    <span v-lang.survey.selectSurvey></span>
                                </router-link>
                            </div>

                            <div class="questions-footer__item">
                                <a class="anim-hover-right questions-footer__link" href="javascript:void(0);" :class="{ 'button-gray--disabled': !filled }" @click.prevent="save">
                                    <span v-lang.survey.next></span>
                                    <i class="anim anim-icon"
                                       :class="{ 'arrow-right-gray-mini-icon': !filled, 'arrow-right-green-mini-icon': filled }"
                                       :style="{backgroundImage: 'url(' + setArrow + ')'}"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-background js-footer-background"></div>
            </div>

            <create-question
                    :is-popup-viewed="isPopupViewed"
                    :is-editing="isEditing"
                    @addNew="isEditing ? editQuestion : addNewQuestion"
                    @close="isPopupViewed = false"
                    ref="createQuestion">
            </create-question>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
    import mixin from '../../../mixins/utils';
    import rightGrayImg from '../../../assets/img/arrow-mini-right-gray-light.svg';
    import rightGreenImg from '../../../assets/img/arrow-mini-right-green.svg';
    import leftGreenImg from '../../../assets/img/arrow-mini-left-green.svg';
    import searchIconImg from '../../../assets/img/search.svg';
    import closePopupIcon from '../../../assets/img/cross.svg';
    import draggable from 'vuedraggable';

    export default {
        name: 'CreateOwnInterview',
        data() {
            return {
                selectedLink: {},
                linksDefault: {},
                sectionLeft: [],
                filter: '',
                isPopupViewed: false,
                isEditing: false,
                showTooltip: false,
                rightGrayImg,
                rightGreenImg,
                leftGreenImg,
                searchIconImg,
                closePopupIcon
            };
        },
        head: {
            title: function () {
                return {
                    inner: this.translate('survey.newSurvey')
                }
            }
        },
        mixins: [ mixin ],
        components: {
            draggable,
            questionItem: () => import("./Question.vue"),
            addedQuestionItem: () => import("./AddedQuestion.vue"),
            createQuestion: () => import("./CreateQuestion.vue"),
            LinkTypeSelect: () => import("../../common/Select.vue")
        },
        created() {
            let root = this;
            (async function() {
                root.linksDefault = {id: null, name: root.translate('survey.allTypes')};
                root.selectedLink = {id: null, name: root.translate('survey.allTypes')};
                root.$store.commit('setFooterView', false);
                root.fillSurvey({value: null});
                await root.getSurvey();
                await root.getRelationshipTypes();
                await root.getQuestions();
                root.sectionLeft = root.questions.orElse([]);
            })();
        },
        mounted() {
            this.calcHeight();
        },
        updated() {
            this.calcHeight();
        },
        computed: {
            selectCurrentLength() {
                return this.selectedLink.name.length > 17;
            },
            setArrow() {
                return this.filled ? this.rightGreenImg : this.rightGrayImg;
            },
            filled() {
                return this.surveyName && this.surveyName.trim().length > 0 && this.sectionRight.length > 0;
            },
            surveyName: {
                get() {
                    return this.survey.orElse({}).name;
                },
                set (value) {
                    this.showTooltip = value.length > 256;
                    this.setSurveyName(value.slice(0, 256));
                }
            },
            sectionRight: {
                get() {
                    return Array.from(this.surveyQuestions);
                },
                set(val) {
                    this.setSurveyQuestions({values: val});
                }
            },
            ...mapState('survey', [
                'survey',
                'relationshipTypes',
                'questions'
            ]),
            ...mapGetters('survey', [
                'getSelectedRelationshipType',
                'existsQuestion',
                'existsAddedQuestion',
                'surveyRelationshipTypeWeights',
                'surveyQuestions'
            ])
        },
        watch: {
            filter(value) {
                this.sectionLeft = this.questions.orElse([]).filter(question => {
                    return (!value && !this.selectedLink.id)
                            || question.text.toLowerCase().includes(value.toLowerCase())
                            && (!this.selectedLink.id || question.questionRelationshipTypes.some((type => type.relationshipType.id === this.selectedLink.id), this));
                }, this);
            },
            selectedLink(selected) {
                this.sectionLeft = this.questions.orElse([]).filter(question => {
                    return (!this.filter || question.text.toLowerCase().includes(this.filter.toLowerCase()))
                            && (!selected.id || question.questionRelationshipTypes.some((type => type.relationshipType.id === selected.id)));
                }, this);
            }
        },
        methods: {
            save(event) {
                (async () => {
                    try {
                        if (this.survey.orElse({}).predefined) {
                            const lastStage = this.survey.orElse({}).lastStage && this.survey.orElse({}).lastStage === 'SurveyNew'
                                    ? 'SurveyNew'
                                    : 'Participants';
                            this.fillSurvey({value: {...this.survey.orElse({}), predefined: false, id: null, lastStage}});
                        }
                        await this.saveSurvey();
                        await this.$router.push({name: 'Participants', params: { id: this.survey.orElse({}).id || ''}});
                    } catch (e) {
                        throw 'Ошибка при создании/сохранении опроса';
                    }
                })();
            },
            calcHeight() {
                let titleHeight = document.querySelector(".js-title-height").offsetHeight;
                let subtitleHeight = document.querySelector(".js-subtitle-height").offsetHeight;
                let searchHeight = document.querySelector(".js-search-height").offsetHeight;
                let footerHeight = document.querySelector(".js-footer-height").offsetHeight;
                let header = document.querySelector(".header-wrap").offsetHeight;
                let totalHeight = `${titleHeight + subtitleHeight + searchHeight + footerHeight + header}px`;
                document.querySelector(".js-questions-list").style.height = `calc(100vh - ${totalHeight})`;

                let inputHeight = document.querySelector(".js-inp").offsetHeight;
                let typesRelationshipsSize = window.getComputedStyle(document.querySelector(".js-types-relationships"));
                let typesRelationships = parseFloat(typesRelationshipsSize.height) + parseFloat(typesRelationshipsSize.marginTop) + parseFloat(typesRelationshipsSize.marginBottom);
                totalHeight = `${inputHeight + typesRelationships + footerHeight + header}px`;
                document.querySelector(".js-management-list-questions").style.height = `calc(100vh - ${totalHeight})`;
                document.querySelector(".js-footer-background").style.height = footerHeight + "px";
            },
            showPopup() {
                this.isEditing = false;
                this.isPopupViewed = !this.isPopupViewed;
            },
            editQuestion() {
                this.isPopupViewed = false;
                this.isEditing = false;
            },
            addNewQuestion() {
                this.isPopupViewed = false;
                this.sectionLeft = this.questions.orElse([]);
            },
            addQuestion(id) {
                let root = this;
                (async function() {
                    if (!root.existsQuestion(id)) {
                        return;
                    }

                    await root.addSurveyQuestion(id);
                    root.sectionLeft = root.questions.orElse([]);
                })();
            },
            updateQuestion(question) {
                this.isEditing = true;
                this.$refs.createQuestion.$emit('updateQuestion', question);
                this.isPopupViewed = true;
            },
            removeQuestion(id) {
                let root = this;
                (async function() {
                    if (!root.existsAddedQuestion(id)) {
                        return;
                    }

                    await root.removeSurveyQuestion(id);
                    root.sectionLeft = root.questions.orElse([]);
                })();
            },
            clearFilter() {
                this.filter = '';
            },
            updateLinkType(link) {
                this.selectedLink = this.relationshipTypes.orElse([]).some(item => item.id === link.id)
                    ? this.getSelectedRelationshipType(link.id)
                    : this.linksDefault;
            },
            ...mapActions('survey', [
                'getSurvey',
                'getRelationshipTypes',
                'getQuestions',
                'saveSurvey',
                'setSurveyName',
                'addSurveyQuestion',
                'removeSurveyQuestion',
                'duplicateAddedQuestion'
            ]),
            ...mapMutations('survey', [
                'fillSurvey',
                'setSurveyQuestions'
            ])
        }
    };
</script>
