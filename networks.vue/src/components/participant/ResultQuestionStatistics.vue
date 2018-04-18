<template>
    <div>
        <div class="question-statistics">
            <div class="question-statistics__item">
                <span v-text="question.text"></span>
            </div>

            <div class="question-statistics__item" v-if="getAnswers[index] && getAnswers[index].employees && getAnswers[index].employees.length">
                <span class="question-statistics__subtitle" v-lang.participants.selected></span>
                <a class="question-statistics__num" href="javascript: void(0);" v-text="selectedEmployees" @click="showEmployees"></a>
            </div>

            <div class="question-statistics__item" v-else>
                <div class="question-statistics__not-answered" v-lang.participants.notSelected></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import mixins from '../../mixins/utils';

    export default {
        props: {
            question: {
                type: Object,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },
        mixins: [ mixins ],
        computed: {
            getAnswers() {
                return this.participantAnswers(this.getSelectOrganization.employeeId);
            },
            selectedEmployees() {
                const selected = this.getAnswers[this.index].employees.length;
                const endWords = [this.translate('participants.employee'), this.translate('participants.employees1'), this.translate('participants.employees2')];
                return `${selected} ${this.declOfNum(selected, endWords)}`;
            },
            ...mapGetters('survey', [
                'participantAnswers'
            ]),
            ...mapGetters([
                'getSelectOrganization'
            ]),
        },
        methods: {
            showEmployees() {
                this.$emit('showEmployees', this.getAnswers[this.index].employees);
            }
        }
    };
</script>