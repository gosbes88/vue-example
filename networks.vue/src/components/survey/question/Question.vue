<template>
    <div @click="addQuestion">
        <div class="questions-list__title" v-text="question.text"></div>
        <ul class="type-relationship-list">
            <li class="type-relationship-list__item" v-for="(item, index, array) in question.questionRelationshipTypes">
                {{ item | getRequiredFields | communicationFilter(index, question.questionRelationshipTypes.length - 1) }}
            </li>
        </ul>
    </div>
</template>

<script>
    import mixin from '../../../mixins/utils';

    export default {
        props: {
            question: {
                type: Object,
                default: () => { return {}; }
            }
        },
        mixins: [ mixin ],
        methods: {
            addQuestion() {
                this.$emit("add", this.question.id);
            }
        },
        filters: {
            getRequiredFields(relation) {
                return {
                    name: relation.relationshipType.name,
                    weight: relation.weight
                };
            }
        }
    };
</script>

<style>

</style>