<template>
    <div class="breadcrumbs" ref="breadcrumbs">
        <div v-for="(step, index) in surveyQuestions" :key="index"
             class="breadcrumbs__item js-breadcrumbs-item"
             :class="{'breadcrumbs__active': isActive(index) }"
             @mouseover="showTooltip(step.id)"
             @mouseleave="hideTooltip(step.id)"
        >
            <div class="breadcrumbs__tooltip js-breadcrumbs-tooltip" :class="{'breadcrumbs__tooltip__show': show[step.id]}">
                <div class="breadcrumbs__wrap js-breadcrumbs-wrap" :style="{marginLeft: calcMargin(step.id)}">
                    <div class="breadcrumbs__text" v-text="step.text"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import mixins from '../../mixins/utils';

    export default {
        data() {
            return {
                show: {}
            };
        },
        mixins: [ mixins ],
        mounted() {
            this.surveyQuestions.forEach(q => this.show[q.id] = false);
        },
        methods: {
            isActive(index) {
                return !index || index < this.participantAnswers(this.getSelectOrganization.employeeId).length + 1;
            },
            calcMargin(id) {
                if (!this.show[id]) {
                    return 0;
                }
                let marginLeft = 0;
                let tooltipSize = this.$refs.breadcrumbs.querySelector('.js-breadcrumbs-tooltip').getBoundingClientRect();
                let itemSize = this.$refs.breadcrumbs.querySelector('.js-breadcrumbs-item').getBoundingClientRect();
                if (tooltipSize.width > itemSize.width) {
                    if (tooltipSize.width / 2 > window.outerWidth - itemSize.left + itemSize.width / 2) {
                        marginLeft = `-${tooltipSize.width - itemSize.width}px`;
                    } else if (tooltipSize.width / 2 < itemSize.left + itemSize.width / 2) {
                        marginLeft = `-${(tooltipSize.width - itemSize.width) / 2}px`;
                    }
                }
                return marginLeft;
            },
            showTooltip(id) {
                this.show = {...this.show, [id]: true};
            },
            hideTooltip(id) {
                this.show = {...this.show, [id]: false};
            }
        },
        computed: {
            ...mapGetters('survey', [
                'surveyQuestions',
                'participantAnswers'
            ]),
            ...mapGetters([
                'getSelectOrganization'
            ])
        }
    };
</script>