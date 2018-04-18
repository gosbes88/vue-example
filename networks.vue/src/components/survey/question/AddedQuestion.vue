<template>
    <div class="question-item">
        <div class="question-item__num"></div>
        <div class="question-item__title">
            <div v-text="questionText"></div>
        </div>
        <div class="question-item__edit">
            <i class="question-item__ellipses-icon ellipses-icon js-edit" :style="{background: 'url(' + moreImg + ')'}" @click.stop="showTooltip"></i>

            <div class="edit-question js-edit-question" v-show="selected">
                <div class="edit-question__item" @click="edit" v-if="question.isAdded">
                    <a class="edit-question__link" href="javascript:void(0);" v-lang.survey.edit></a>
                </div>
                <div class="edit-question__item" @click="duplicate">
                    <a class="edit-question__link" href="javascript:void(0);" v-lang.survey.duplicate></a>
                </div>
                <div class="edit-question__item" @click="remove">
                    <a class="edit-question__link" href="javascript:void(0);" v-lang.survey.remove></a>
                </div>
            </div>
        </div>
        <div class="question-item__drag">
            <i class="question-item__drag-icon drag-icon" :style="{background: 'url(' + dragImg + ')'}"></i>
        </div>
    </div>
</template>

<script>
    import dragImg from '../../../assets/img/questions/drag.svg';
    import moreImg from '../../../assets/img/questions/more.svg';
    import { bus } from '../../../main';

    export default {
        props: {
            question: {
                type: Object,
                required: true
            },
            index: Number
        },
        data () {
            return {
                selected: false,
                dragImg,
                moreImg
            };
        },
        created() {
            bus.$on("hide", data => this.selected = data);
            document.addEventListener("click", this.hide.bind(this));
        },
        beforeDestroy() {
            document.removeEventListener("click", this.hide.bind(this));
        },
        methods: {
            remove() {
                this.$emit("removeQuestion", this.question.id);
            },
            edit() {
                this.$emit("updateQuestion", JSON.parse(JSON.stringify(this.question)));
            },
            duplicate() {
                this.$emit("duplicateQuestion", this.question.id);
            },
            showTooltip() {
                const oldValue = this.selected;
                bus.$emit('hide', false);
                this.selected = !oldValue;
            },
            hide() {
                bus.$emit('hide', false);
            }
        },
        computed: {
            questionText() {
                return this.question.text.trim().endsWith('?') ? this.question.text : `${this.question.text}?`;
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped></style>