<template>
    <tr class="employees-table__row" @click="addParticipants">
        <td class="employees-table__cell employees-table__user-info">
            <div class="user-info">
                <img class="user-info__img" :src="getAvatar">
                <div class="user-info__content">
                    <div class="user-info__row">
                        <div class="user-info__fullname" v-text="getParticipantInfo"></div>

                        <div v-if="employee.surveyParticipateCount > 0" :title="getProjectsCount">
                            <i class="employee-fullname__participated logo-mini-gray" :style="{background: 'url(' + logoImg + ') no-repeat'}"></i>
                        </div>
                    </div>

                    <div class="user-info__position" v-text="getPositionWithDepartment"></div>
                </div>
            </div>
        </td>
    </tr>
</template>

<script>
    import mixin from "../../../mixins/utils";
    import avatarImg from '../../../assets/img/avatar-default.png';
    import logoImg from '../../../assets/img/assessment-logo-gray.svg';

    export default {
        data() {
            return {
                imageDefault: avatarImg,
                logoImg,
                configurationOrganizationsUrl: "/organizations/"
            };
        },
        props: {
            employee: {
                type: Object,
                default: () => { return {}; }
            }
        },
        mixins: [ mixin ],
        computed: {
            getProjectsCount() {
                let wordEnd = [this.translate("participants.project"), this.translate("participants.projects"), this.translate("participants.projects")];
                return `${this.translate("participants.already")} ${this.employee.surveyParticipateCount} ${this.declOfNum(this.employee.surveyParticipateCount, wordEnd)}`;
            },
            getAvatar() {
                return this.employee.avatar
                        ? `${this.configurationOrganizationsUrl}/img/employee/${this.employee.id}/avatar`
                        : `${this.imageDefault}`;
            },
            getParticipantInfo() {
                return `${this.employee.lastName || ''} ${this.employee.name || ''} ${this.employee.dismissed ? this.translate('participants.dismissed') : ''}`;
            },
            getPositionWithDepartment() {
                return `${this.employee.positionName || ''}${this.employee.departmentName && this.employee.positionName ? ', ' : ''}${this.employee.departmentName || ''}`;
            }
        },
        methods: {
            addParticipants() {
                this.$emit('addParticipants', [this.employee.id]);
            }
        }
    };
</script>

<style>

</style>