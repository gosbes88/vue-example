import { Doughnut } from 'vue-chartjs';

export default {
    extends: Doughnut,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options ? this.options : {responsive: false, maintainAspectRatio: false});
    }
};