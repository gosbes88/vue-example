<template>
    <tr class="participants-project__row">
        <td class="participants-project__cell participants-project__user-info">
            <div class="user-info">
                <img class="user-info__img" :src="getAvatar">
                <div class="user-info__content user-info__content--size">
                    <div class="user-info__fullname" v-text="getParticipantInfo"></div>
                    <div class="user-info__position" v-text="getPositionWithDepartment"></div>
                </div>
            </div>
        </td>
        <td class="participants-project__cell participants-project__completed-tasks js-filled" v-html="getPercent"></td>
    </tr>
</template>

<script>
    import imageDefault from '../../../assets/img/avatar-default.png';
    import { mapState, mapGetters } from 'vuex';

    export default {
        props: {
            participant: {
                type: Object,
                default: () => { return {}; }
            }
        },
        data() {
            return {
                imageDefault
            };
        },
        computed: {
            getAvatar() {
                return this.participant.avatar
                    ? `/organizations/img/employee/${this.participant.id}/avatar`
                    : `${this.imageDefault}`;
            },
            getParticipantInfo() {
                return `${this.participant.lastName || ''} ${this.participant.name || ''}`;
            },
            getPositionWithDepartment() {
                return `${this.participant.positionName || ''}${this.participant.positionName && this.participant.departmentName ? ', ' : ''}${this.participant.departmentName || ''}`;
            },
            getPercent() {
                const answers = this.getParticipantByEmployeeId(this.participant.id).answers;
                return answers && answers.length
                    ?  parseInt(answers.length / this.surveyQuestions.length * 100) + '%'
                    : "<span class=\"text-mdash\">&mdash;</span>";
            },
            ...mapState('survey', [
                'survey'
            ]),
            ...mapGetters('survey', [
                'surveyQuestions',
                'getParticipantByEmployeeId'
            ])
        }
    }
</script>