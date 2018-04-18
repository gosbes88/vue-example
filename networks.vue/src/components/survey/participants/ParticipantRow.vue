<template>
    <tr>
        <td class="employees-delete__table-cell table-default__cell" style="min-width: 403px;">
            <div class="user-info">
                <img class="user-info__img" :src="getAvatar">
                <div class="user-info__content user-info__content--multiline" :class="{'text-disabled': participant.dismissed}">
                    <div class="user-info__fullname" style="position: relative;">
                        <span v-text="getParticipantInfo"></span>
                        <span v-if="participant.surveyParticipateCount > 0" :title="getProjectsCount">
                            <i class="employee-fullname__participated logo-mini-gray" :style="{background: 'url(' + logoImg + ') no-repeat'}"></i>
                        </span>
                    </div>
                    <div class="user-info__position" v-text="getPositionWithDepartment"></div>
                </div>
            </div>
        </td>

        <td class="employees-delete__table-cell-rate employees-delete__table-cell table-default__cell">
            <added-connections
                    v-if="existsEmployeeConnections"
                    class="pull-right"
                    :employee-ids="[participant.id]"
                    :consumer="consumer"
            ></added-connections>
        </td>

        <td class="employees-delete__table-cell-del employees-delete__table-cell table-default__cell text-center">
            <i v-if="canRemoved"
               class="close-light-icon"
               @click="remove"
               :style="{background: 'url(' + closePopupIcon + ') no-repeat'}"></i>
        </td>
    </tr>
</template>

<script>
    import mixin from "../../../mixins/utils";
    import imageDefault from '../../../assets/img/avatar-default.png';
    import logoImg from '../../../assets/img/assessment-logo-gray.svg';
    import closePopupIcon from '../../../assets/img/cross.svg';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                imageDefault,
                logoImg,
                closePopupIcon,
                configurationOrganizationsUrl: "/organizations/"
            };
        },
        props: {
            participant: {
                type: Object,
                default: () => { return {}; }
            },
            existsEmployeeConnections: {
                type: Boolean,
                default: false
            },
            consumer: {
                type: Function,
                required: true
            }
        },
        mixins: [ mixin ],
        components: {
            AddedConnections: () => import("./AddedConnections.vue")
        },
        computed: {
            canRemoved() {
                return this.addedEmployees.some(p => p.employeeId === this.participant.id && !p.startedSurvey);
            },
            getProjectsCount() {
                let wordEnd = [this.translate("participants.project"), this.translate("participants.projects"), this.translate("participants.projects")];
                return `${this.translate("participants.already")} ${this.participant.surveyParticipateCount} ${this.declOfNum(this.participant.surveyParticipateCount, wordEnd)}`;
            },
            getAvatar() {
                return this.participant.avatar
                    ? `${this.configurationOrganizationsUrl}/img/employee/${this.participant.id}/avatar`
                    : `${this.imageDefault}`;
            },
            getParticipantInfo() {
                return `${this.participant.lastName || ''} ${this.participant.name || ''} ${this.participant.dismissed ? this.translate('participants.dismissed') : ''}`;
            },
            getPositionWithDepartment() {
                return `${this.participant.positionName || ''}${this.participant.positionName && this.participant.departmentName ? ', ' : ''}${this.participant.departmentName || ''}`;
            },
            ...mapGetters('survey', [
                'addedEmployees'
            ])
        },
        methods: {
            remove() {
                this.$emit('removeParticipants', this.addedEmployees.filter(p => p.employeeId === this.participant.id).map(p => p.id));
            }
        }
    };
</script>