<template>
    <div>
        <div v-text="data.competence.name"></div>
        <div style="width: 960px; height: 400px; position: relative">
            <svg :id="`chart${index}`"></svg>
            <div class="d3-tip" :class="`tip${index}`" style="opacity: 0;"></div>
        </div>
    </div>
</template>

<script>
    import { RatingsChart } from '../../../../utils/RatingsChart';

    export default {
        props: {
            index: {
                type: Number
            },
            data: {
                type: Object,
                default: () => ({})
            }
        },
        mounted() {
            RatingsChart.create(
                this.data.availableRatings,
                `#chart${this.index}`,
                `.tip${this.index}`,
                {width: 960, height: 400, marginLeft: 60, marginTop: 40, marginBottom: 60, marginRight: 40, yTitle: this.translate("employees.values"), competence: this.data.competence}
            );
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

    .axis path,
    .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
    }

    .bar {
        fill: '#347689';
    }

    .bar:hover {
        fill: '#000';
    }
</style>