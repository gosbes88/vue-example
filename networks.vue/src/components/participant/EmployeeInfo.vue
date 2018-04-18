<template>
    <div class="employees-rate-list__item"
         :class="{'employees-rate-list__item--cur': containsEmployee(employee.id)}"
         @mousedown.left="handleClick"
    >
        <div class="employees-rate-list__avatar js-employee-select">
            <img class="employees-rate-list__avatar-img" :src="getAvatar"/>
        </div>
        <div class="employees-rate-list__full-name" v-text="getEmployeeName"></div>
        <div class="employees-rate-list__position" v-text="employee.positionName || ''"></div>
        <div v-show="containsEmployee(employee.id)" :style="{background: 'url(' + SelectionImg + ') no-repeat'}" class="employee__item-select"></div>
    </div>
</template>

<script>
    import AvatarImg from '../../assets/img/avatar-default-big.png';
    import SelectionImg from '../../assets/img/employee-selection.svg';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        props: {
            employee: {
                type: Object,
                default: () => { return {}; }
            }
        },
        data() {
            return {
                AvatarImg,
                SelectionImg
            };
        },
        methods: {
            handleClick() {
                this.containsEmployee(this.employee.id)
                        ? this.removeEmployeeFromAnswer({value: this.employee.id})
                        : this.addEmployeeToAnswer({value: this.employee});
            },
            ...mapMutations('participant', [
                'addEmployeeToAnswer',
                'removeEmployeeFromAnswer'
            ])
        },
        computed: {
            getAvatar() {
                return this.employee.avatar
                    ? `/organizations/img/employee/${this.employee.id}/avatar`
                    : `${this.AvatarImg}`;
            },
            getEmployeeName() {
                return `${this.employee.lastName || ''} ${this.employee.name || ''}`;
            },
            ...mapGetters('participant', [
                'containsEmployee'
            ]),
        },
    };
</script>

<style lang="less" rel="stylesheet/less">
    .employees-rate-list {
        &__item--cur {
            &:after {
                background: inherit;
            }
        }
    }

    .employee__item-select {
        content: "";
        position: absolute;
        top: 23px;
        left: 33px;
        width: 49px;
        height: 49px;
    }
</style>