<template>
    <div class="create-survey-list__item" :class="{'create-survey-list__item--selected': selected}" @click="selectSurvey">
        <div class="create-survey-item">
            <div class="create-survey-item__info" v-if="survey !== null">
                <h3 class="create-survey-item__title" v-text="survey.name"></h3>
                <div class="create-survey-item__desc">
                    <span v-for="(item, index) in relations" :key="index">{{ item | communicationFilter(index, relations.length - 1) }}</span>
                    <span class="create-survey-item__questions" v-text="getQuestionsCount(survey.questions.length)" ></span>
                </div>
            </div>

            <div class="create-survey-item__info" v-else>
                <h3 class="create-survey-item__title" v-lang.survey.createOwn></h3>
                <div class="create-survey-item__desc" v-lang.survey.ownDescription></div>
            </div>

            <div class="create-survey-item__selected">
                <i class="select-profile-icon" :class="{'hidden': !selected}" :style="{background: 'url(' + checkImg + ') no-repeat'}"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '../../../mixins/utils';
    import checkImg from '../../../assets/img/check.svg';

    export default {
        name: 'SurveyItem',
        data() {
            return {
                selected: false,
                checkImg
            };
        },
        mixins: [ mixin ],
        props: {
            survey: {
                type: Object,
                default: () => { return {}; }
            },
            relations: {
                type: Array,
                default: () => []
            }
        },
        created() {
            this.$on("changeSelected", (id) => {
                this.selected = this.survey && this.survey.id === id || !this.survey && id === 'OWN';
            });

        },
        methods: {
            selectSurvey() {
                this.selected = !this.selected;
                this.$emit("select", this.survey ? this.survey.id : 'OWN', this.selected);
            },
            getQuestionsCount(questionsCount) {
                return `${questionsCount} ${this.declOfNum(questionsCount, [this.translate('survey.question1'), this.translate('survey.question2'), this.translate('survey.question3')])}`;
            }
        }
    };
</script>