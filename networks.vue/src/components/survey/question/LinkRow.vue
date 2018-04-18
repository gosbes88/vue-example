<template>
    <tr class="add-question-table__row">
        <td class="add-question-table__cell add-question-table__type-rel js-rel-width-cell" v-text="communicationType.relationshipType.name"></td>
        <td class="add-question-table__cell add-question-table__num">
            <input class="add-question-table__inp-num" v-if="isInputViewed" v-focus @focusout="changeWeight" type="number" :value="weight" @input="changeValue"/>
            <div class="add-question-table__inp-num-wrap" v-else @click="showInput" v-text="communicationType.weight + '%'"></div>
        </td>
        <td class="add-question-table__cell add-question-table__range">
            <div class="add-question-table__range-wrap">
                <div class="add-question-table__rating" v-text="linkPower(communicationType.weight)"></div>
                <input class="add-question-table__inp-range" type="range"  min="0" max="100" step="1" :value="weight" @input="setValue" />
            </div>
        </td>
    </tr>
</template>

<script>
    export default {
        props: ["link"],
        data() {
            return {
                communicationType: JSON.parse(JSON.stringify(this.link)),
                weight: this.link.weight,
                isInputViewed: false
            };
        },
        methods: {
            linkPower(val) {
                switch (true) {
                    case val <= 25:
                        return this.translate('survey.weakly');
                    case val > 25 && val <= 50:
                        return this.translate('survey.belowAverage');
                    case val > 50 && val <= 75:
                        return this.translate('survey.medium');
                    case val > 75:
                        return this.translate('survey.strong');
                    default:
                        return null;
                }
            },
            setValue(event) {
                this.changeValue(event);
                this.changeWeight();
            },
            changeValue($event) {
                let value = parseInt($event.target.value) > 100 ? 100 : parseInt($event.target.value) || 0;
                this.communicationType.weight = value;
                this.weight = value;
            },
            showInput() {
                this.isInputViewed = true;
                this.weight = this.communicationType.weight;
            },
            changeWeight() {
                this.isInputViewed = false;
                this.$emit("changeWeight", this.communicationType.relationshipType.id, this.communicationType.weight);
            }
        }
    };
</script>

<style></style>