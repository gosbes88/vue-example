<template>
    <div class="employee-item">
        <div class="employee-item__group">
            <div class="employee-item__content">
                <div class="employee-item__avatar">
                    <img class="employee-item__avatar-img" :src="getAvatar" />
                </div>

                <div class="employee-item__info">
                    <div class="employee-item__fullname" v-text="getEmployeeName"></div>
                    <div class="employee-item__position" v-text="employee.positionName || ''"></div>
                </div>
            </div>
        </div>

        <div class="employee-item__del">
            <i class="employee-item__icon-del" @click="remove">
                &times;
            </i>
        </div>
    </div>
</template>

<script>
    import AvatarImg from '../../assets/img/avatar-default.png';
    import { mapMutations } from 'vuex';

    export default {
        props: {
            employee: {
                type: Object,
                default: () => { return {}; }
            }
        },
        data() {
            return {
                AvatarImg
            };
        },
        computed: {
            getAvatar() {
                return this.employee.avatar
                        ? `/organizations/img/employee/${this.employee.id}/avatar`
                        : `${this.AvatarImg}`;
            },
            getEmployeeName() {
                return `${this.employee.lastName || ''} ${this.employee.name || ''}`;
            }
        },
        methods: {
            remove() {
                this.removeEmployeeFromAnswer({value: this.employee.id});
            },
            ...mapMutations('participant', [
                'removeEmployeeFromAnswer'
            ])
        }
    };
</script>