<template>
    <div style="justify-content: space-around !important;">
        <survey-statistic-item
                v-for="(item, index) in surveys"
                :key="index"
                :item="item"
                :chart-position="{}"
                :progress-position="{}"
        ></survey-statistic-item>
    </div>
</template>

<script>
    import SurveyStatisticItem from './SurveyStatisticItem.vue';

    export default {
        props: {
            surveys: {
                type: Array,
                default: () => []
            }
        },
        components: {
            SurveyStatisticItem
        }
    };
</script>

<style>

</style>