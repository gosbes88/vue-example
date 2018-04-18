<template>
    <div>
        <div v-if="/*allEmployeesRelationships.orElse([]).length*/true">
            <svg id="relations" style="width: 836px;height: 836px;" ref="relations"></svg>
            <div class="d3-tip js-tooltip" style="opacity: 0;"></div>
        </div>
        <div v-else ref="empty" class="relationships__empty" v-lang.survey.allRelationsNone></div>
    </div>
</template>

<script>
    import { NetworksGraph } from "../../../utils/NetworksGraph";
    import { mapState } from 'vuex';
    import DATA from './data';

    export default {
        data() {
            return {
                graph: null
            };
        },
        props: {
            relation: {
                type: String,
                default: null
            }
        },
        watch: {
            allEmployeesRelationships(val) {
                // if (!val.orElse([]).length) {
                //     return;
                // }
                // if (this.graph) {
                //     this.graph = new NetworksGraph([], '', '', {});
                //     this.graph.init();
                // } else {
                //     this.graph.update();
                // }
            }
        },
        created() {
            this.$bus.$on("windowResize", this.recalcHeight);
        },
        mounted() {
            this.recalcHeight();
            this.draw();
        },
        methods: {
            recalcHeight() {
                if (!this.$refs.empty) {
                    return;
                }
                let nav = document.querySelector('.game-indicators-nav');
                let elemHeader = document.querySelector('.header-wrap');
                const mainBlockPadding = parseFloat(window.getComputedStyle(document.querySelector("#list-block-panel")).paddingTop);
                this.$refs.empty.style.height = `${window.innerHeight - elemHeader.offsetHeight - nav.offsetHeight - mainBlockPadding}px`;
            },
            draw() {
                //networks, svgSelector, tooltipSelector, {width, height, marginLeft, marginRight, marginTop, marginBottom}
                const options = {
                    width: this.$refs.relations.clientWidth,
                    height: this.$refs.relations.clientHeight,
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 20,
                    marginTop: 20
                };
                NetworksGraph.create(DATA, '#relations', '.js-tooltip', options);
            }
        },
        computed: {
            ...mapState('survey', [
                'allEmployeesRelationships'
            ])
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    .d3-tip {
        position: absolute;
        padding: 10px;
        overflow: hidden;
        width: 100px;
        margin-left: -50px;
        min-height: 40px;
        background: #fff;
        border-radius: 15px;
        font-weight: bold;
        z-index: 99999;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, .2);
    }

    .relationships__empty {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .node-glyph {
        width: 15px;
        height: 15px;
        stroke-width: 1px;
        fill: orange;
        stroke: red;
    }

    .glyph-label {
        font-weight: bold;
        font-size: 10px;
        color: #fff;
    }

    .background {
        opacity: 0.3;
    }

    .background-line {
        opacity: 0.2;
    }
</style>