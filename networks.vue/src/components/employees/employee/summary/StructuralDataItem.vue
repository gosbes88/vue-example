<template>
    <div class="structural-data__item">
        <div class="structural-data-block">
            <div class="structural-data-block__row">
                <div class="structural-data-block__head">
                    <div class="structural-data-block__title" v-text="item.indicator.name"></div>
                    <div class="structural-data-block__status">
                        <div class="status-block">
                            <i class="status-red" :style="{background: 'url(' + redImg + ') no-repeat'}"></i>
                            <i class="status-yellow" :style="{background: 'url(' + yellowImg + ') no-repeat'}"></i>
                            <i class="status-green" :style="{background: 'url(' + greenImg + ') no-repeat'}"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="structural-data-block__row">
                <div class="structural-data-block__main">
                    <div :style="{'color': getColor}" class="structural-data-block__num-big" v-text="item.value"></div>
                    <div class="structural-data-block__progress-wrap">
                        <progress class="progress" :value="progress" max="100" ref="progress"></progress>
                        <i class="structural-data-block__arrow-icon" :style="{'left': paddingProgress + 'px'}" ref="arrow"></i>
                    </div>
                    <div class="structural-data-block__score">
                        <span v-lang.employees.averageScore></span>
                        <span class="structural-data-block__average-score" v-text="item.avgValue"></span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import redImg from '../../../../assets/img/information-employee/status.svg';
    import yellowImg from '../../../../assets/img/information-employee/status-yellow.svg';
    import greenImg from '../../../../assets/img/information-employee/status-green.svg';
    import { MAX_SCORE_COMPETENCE as maxScore } from '../../../../utils/Constants';
    import { Optional } from '../../../../utils/Optional';
    import { bus } from '../../../../main';

    export default {
        data() {
            return {
                redImg,
                yellowImg,
                greenImg,
                paddingProgress: 0
            };
        },
        props: {
            item: {
                type: Object,
                default: () => { return {}; }
            },
            id: {
                type: String,
                required: true
            }
        },
        mounted() {
            const onePercent = this.$refs.progress.clientWidth / 100;
            this.paddingProgress = onePercent * this.progressAverage - (this.$refs.arrow.offsetWidth / 2);
            bus.$emit('load', this.id);
        },
        computed: {
            progress() {
                return Optional.create(this.item.value * 100 / maxScore).orElse(0);
            },
            progressAverage() {
                return Optional.create(this.item.avgValue * 100 / maxScore).orElse(0);
            },
            getColor() {
                switch (true) {
                    case this.progress === 0:
                        return '#999';
                    case this.progress < 33:
                        return '#a41732';
                    case this.progress < 66:
                        return '#ff9a00';
                    case this.progress <= 100:
                        return '#73af2e';
                    default:
                        return '#999';
                }
            }
        }
    };
</script>