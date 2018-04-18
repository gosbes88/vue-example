<template>
    <div v-show="isPopupViewed" class="flex-popup-wrap flex-popup-show">
        <div class="flex-popup" @click.self="closePopup">
            <div class="flex-popup__content popup-add-question">
                <i @click="closePopup" class="flex-popup__close close-light-icon" :style="{background: 'url(' + closePopupIcon + ') no-repeat'}"></i>

                <div class="flex-article">
                    <div class="flex-article__head">
                        <h3 class="popup-add-question__title" v-lang.participants.selectedParticipants></h3>
                    </div>
                    <div class="flex-article__main mb-2">

                        <div class="selected-employees-list">
                            <div class="selected-employees-list__item" v-for="(employee, index) in employees" :key="index">
                                <div class="employees-table__cell employees-table__user-info">
                                    <div class="user-info">
                                        <img class="user-info__img" :src="getAvatar(employee)">
                                        <div class="user-info__content">
                                            <div class="user-info__row">
                                                <div class="user-info__fullname" v-text="getParticipantInfo(employee)"></div>
                                            </div>
                                            <div class="user-info__position" v-text="getPositionWithDepartment(employee)"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import employeeMixin from '../../mixins/EmployeeData';
    import closePopupIcon from '../../assets/img/cross.svg';

    export default {
        data() {
            return {
                closePopupIcon
            }
        },
        props: {
            isPopupViewed: {
                type: Boolean,
                default: false
            },
            employees: {
                type: Array,
                default: () => []
            }
        },
        mixins: [ employeeMixin ],
        methods: {
            closePopup() {
                this.$emit('close');
            }
        }
    };
</script>