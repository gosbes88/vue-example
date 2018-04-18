<template>
    <div class="competence-item competence-item--hover">
        <div class="competence-item__title" v-text="relation.relationshipType.name"></div>

        <div class="competence-item__num" v-text="index"></div>

        <div class="competence-item__prg">
            <div class="graph-line graph-line--gray" :class="{'graph-line--green': isSelected}">
                <div class="graph-line__progress" :style="{width: widthByIndex + '%'}"></div>
                <div class="graph-line__mark" :style="{width: widthByAverageIndex + '%'}"></div>
            </div>
        </div>

        <div class="help-tooltip-wrap">
            <span v-text="relation.weight + '%'"></span>
            <div class="help-tooltip help-objectivity-rating" v-lang.survey.relationWeight></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            relation: {
                type: Object,
                required: true
            },
            isSelected: {
                type: Boolean,
                default: false
            },
            averageIndex: {
                type: Number,
                default: 0
            },
            index: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                maxIndex: 100 //TODO: временная заглушка - убрать, когда прояснится ситуация по необходимости использовать max показатель индекса
            };
        },
        computed: {
            widthByIndex() {
                return this.index * 100 / this.maxIndex;
            },
            widthByAverageIndex() {
                return this.averageIndex * 100 / this.maxIndex;
            }
        }
    };
</script>