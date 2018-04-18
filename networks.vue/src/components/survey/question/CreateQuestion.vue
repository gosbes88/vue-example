<template>
    <div v-show="isPopupViewed" class="flex-popup-wrap flex-popup-show">
        <div class="flex-popup" @click.self="closePopup">
            <div class="flex-popup__content popup-add-question">
                <i @click="closePopup" class="flex-popup__close close-light-icon" :style="{background: 'url(' + closePopupIcon + ') no-repeat'}"></i>

                <div class="flex-article">
                    <div class="flex-article__head">
                        <h3 class="popup-add-question__title" v-text="isEditing ? translate('survey.editTitle') : translate('survey.addTitle')"></h3>
                    </div>
                    <div class="flex-article__main">
                        <textarea class="popup-add-question__textarea mb-2 js-textarea"
                                rows="1"
                                v-model="question.text"
                                :placeholder="translate('survey.formulate')"
                                v-autosize ="question.text"
                                ref="questionSummary">
                        </textarea>

                        <div class="mb-2" v-lang.survey.selectLinks></div>

                        <div class="mb-2" v-show="relations.length > 0">
                            <added-link-select class="popup-add-question__select"
                                               :classSelectedCurrent="'select__current--small'"
                                               :elements="relations"
                                               :selectedElement="selectedElement"
                                               @selectElement="addLink"
                            >
                            </added-link-select>
                        </div>

                        <table class="add-question-table js-table-width" v-show="isLinkViewed">
                            <thead>
                                <tr>
                                    <th class="add-question-table__title add-question-table__type-rel js-type-rel-width" v-lang.survey.type></th>
                                    <th class="add-question-table__title add-question-table__much" colspan="2" v-lang.survey.weight></th>
                                </tr>
                            </thead>
                            <tbody class="add-question-table__body js-table-body">
                                <tr is="LinkRow" v-for="(link, index) in question.questionRelationshipTypes" :key="index" :link="link" @changeWeight="changeWeight"></tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex-article__footer">
                        <a @click="addQuestion" :class="isDisabled" class="flex-article__footer-btn" href="javascript:void(0);">OK</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '../../../mixins/utils';
    import { mapState, mapMutations, mapActions } from 'vuex';
    import closePopupIcon from '../../../assets/img/cross.svg';

    export default {
        props: {
            isPopupViewed: Boolean,
            isEditing: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                closePopupIcon,

                question: {
                    id: null,
                    text: "",
                    questionRelationshipTypes: [],
                    isAdded: true
                },
                defaultQuestion: {
                    id: null,
                    text: "",
                    questionRelationshipTypes: [],
                    isAdded: true,
                }
            };
        },
        components: {
            LinkRow: () => import('./LinkRow.vue'),
            AddedLinkSelect: () => import('../../common/Select.vue')
        },
        mixins: [ mixin ],
        computed: {
            isLinkViewed() {
                return this.question.questionRelationshipTypes && this.question.questionRelationshipTypes.length > 0;
            },
            isDisabled() {
                return {"disabled": !this.question.text.trim().length > 0 || !this.question.questionRelationshipTypes.length};
            },
            selectedElement() {
                return {
                    id: null,
                    name: this.translate('survey.addLink')
                };
            },
            relations() {
                return this.relationshipTypes.orElse([]).filter(item => {
                    return this.question.questionRelationshipTypes.every(el => el.relationshipType.id !== item.id);
                }, this);
            },
            ...mapState('survey', [
                'relationshipTypes'
            ])
        },
        created() {
            this.$on("updateQuestion", question => this.question = Object.assign({}, question));
        },
        updated() {
            this.$nextTick(function () {
                let tableWidth = document.querySelector(".js-table-width").offsetWidth;
                if (document.querySelector(".js-table-body")) {
                    document.querySelector(".js-table-body").style.width = tableWidth + "px";
                }
                let typeRelWidth = document.querySelector(".js-type-rel-width").offsetWidth;
                if (document.querySelector(".js-rel-width-cell")) {
                    let tableCell = document.querySelectorAll('.js-rel-width-cell');

                    tableCell.forEach(e => e.style.width = typeRelWidth + "px");
                    tableCell.forEach(e => e.style.minWidth = typeRelWidth + "px");
                    tableCell.forEach(e => e.style.maxWidth = typeRelWidth + "px");
                }
            })
        },
        methods: {
            addQuestion() {
                if (!this.question.id) {
                    let isGenerate = true;
                    while(isGenerate && !this.question.id) {
                        let id = this.generateUUID();
                        isGenerate = this.relationshipTypes.orElse([]).some(linkType => linkType.id === id);
                        this.question.id = id;
                    }
                }
                this.addNewQuestionToSurvey(this.question);
            },
            async addNewQuestionToSurvey() {
                try {
                    if (Object.keys(this.question).length === 0) {
                        return;
                    }
                    let response = await this.$http.post('/networks/service/rest/m/questions', this.question);
                    let question = response.body;
                    if (!question) {
                        return;
                    }
                    if (this.isEditing) {
                        this.updateSurveyQuestion(question);
                        this.recalcRelationshipTypeWeights();
                    } else {
                        this.addNewQuestion({value: question});
                    }
                    this.$emit('addNew');
                    this.closePopup();
                } catch (e) {
                    console.error(e);
                }
            },
            addLink(link) {
                this.relationshipTypes.orElse([]).some(linkType => {
                    if (linkType.id === link.id) {
                        let relationshipTypeWeight = {
                            weight: 0,
                            relationshipType: JSON.parse(JSON.stringify(linkType))
                        };
                        this.question.questionRelationshipTypes.push(relationshipTypeWeight);
                        return true;
                    }
                    return false;
                });
            },
            closePopup() {
                this.$emit('close');
                this.question = JSON.parse(JSON.stringify(this.defaultQuestion));
            },
            changeWeight(id, weight) {
                this.question.questionRelationshipTypes.some(communicationType => {
                    if (communicationType.relationshipType.id === id) {
                        communicationType.weight = weight;
                        return true;
                    }
                    return false;
                });
            },
            ...mapMutations('survey', [
                'addNewQuestion'
            ]),
            ...mapActions('survey', [
                'updateSurveyQuestion',
                'recalcRelationshipTypeWeights'
            ])
        }
    };
</script>

<style lang="less" scoped>
    .disabled {
        color: #ccc !important;
        pointer-events: none;
    }
</style>