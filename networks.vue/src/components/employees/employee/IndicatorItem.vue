<template>
    <div class="key-indicators__item">
        <div class="competence-block">
            <div class="competence-block__head">
                <div class="competence-block__title" v-text="item.indicator.name" :title="item.indicator.name"></div>
                <div class="competence-block__points" v-lang.employees.averageScore></div>
            </div>

            <div class="competence-block__main">
                <div class="competence-block__col-1">
                    <div class="competence-block__rating">
                        <div :style="{'color': getColor(progress)}" class="competence-block__num-big" v-text="item.value"></div>
                        <div class="competence-block__icons">
                            <div class="status-block">
                                <i class="status-red" :style="{background: 'url(' + redImg + ') no-repeat'}"></i>
                                <i class="status-yellow" :style="{background: 'url(' + yellowImg + ') no-repeat'}"></i>
                                <i class="status-green" :style="{background: 'url(' + greenImg + ') no-repeat'}"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="competence-block__col-2">
                    <water-ball :width="110"
                                :height="110"
                                :value="item.value"
                                :max-value="maxValue"
                                :options="options"
                    ></water-ball>
                </div>

                <div class="competence-block__col-3">
                    <div class="competence-block__line-container">
                        <div class="competence-block__vertical-line" ref="progress"></div>

                        <div class="competence-block__result" :style="{'bottom': paddingProgress + 'px'}">
                            <i class="competence-block__arrow-icon" ref="arrow"></i>
                            <div class="competence-block__num" v-text="item.avgValue"></div>
                        </div>
                    </div>

                    <i class="competence-block__info-light-icon info-light-icon" :style="{background: 'url(' + infoImg + ') no-repeat'}"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import redImg from '../../../assets/img/information-employee/status.svg';
    import yellowImg from '../../../assets/img/information-employee/status-yellow.svg';
    import greenImg from '../../../assets/img/information-employee/status-green.svg';
    import infoImg from '../../../assets/img/information-employee/info-light.svg';
    import { Optional } from '../../../utils/Optional';
    import { bus } from '../../../main';
    import indicatorMixins from '../../../mixins/Indicators';

    export default {
        data() {
            return {
                redImg,
                yellowImg,
                greenImg,
                infoImg,
                paddingProgress: 0
            };
        },
        props: {
            item: {
                type: Object,
                default: () => { return {}; }
            },
            maxValue: {
                type: Number,
                required: true
            },
            id: {
                type: String,
                required: true
            }
        },
        mixins: [ indicatorMixins ],
        components: {
            WaterBall: () => import('../../common/WaterBall.vue')
        },
        mounted() {
            const onePercent = this.$refs.progress.offsetHeight / 100;
            this.paddingProgress = onePercent * this.progressAverage + (this.$refs.arrow.offsetHeight / 2);
            bus.$emit('load', this.id);
        },
        computed: {
            options() {
                return {
                    colorFill: this.getColorFill,
                    lineWidth: 1,
                    colorLine: 'rgba(0, 0, 0, .1)'
                };
            },
            progress() {
                return Optional.create(this.item.value * 100 / this.maxValue).orElse(0);
            },
            progressAverage() {
                return Optional.create(this.item.avgValue * 100 / this.maxValue).orElse(0);
            },
            getColorFill() {
                switch (true) {
                    case this.progress === 0:
                        return 'rgba(0, 0, 0, .33)';
                    case this.progress < 33:
                        return 'rgba(255, 0, 0, .33)';
                    case this.progress < 66:
                        return 'rgba(255, 154, 0, 0.33)';
                    case this.progress <= 100:
                        return 'rgba(54, 190, 65, 0.33)';
                    default:
                        return 'rgba(0, 0, 0, .3)';
                }
            }
        }
    };
</script>