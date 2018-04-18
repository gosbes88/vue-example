<template>
    <div class="user-information">
        <div class="user-information__col-1">
            <img class="user-information__avatar" :src="getAvatar(employee)">
        </div>

        <div class="user-information__col-2">
            <div class="user-information__row">
                <div class="user-information__full-name" v-text="getParticipantInfo(employee)"></div>
            </div>

            <div class="user-information__row" v-if="employee.positionName">
                <div class="user-information__content">
                    <div class="user-information__title" v-lang.survey.position></div>
                    <div class="user-information__desc" v-text="employee.positionName"></div>
                </div>
            </div>

            <div class="user-information__row" v-if="employee.departmentName">
                <div class="user-information__content">
                    <div class="user-information__title" v-lang.survey.departmentTitle></div>
                    <div class="user-information__desc" v-text="employee.departmentName"></div>
                </div>
            </div>

            <div class="user-information__row" v-if="employee.managerId">
                <div class="user-information__content">
                    <div class="user-information__title" v-lang.survey.head></div>
                    <div class="user-information__desc" v-text="employee.managerName"></div>
                </div>
            </div>

            <div class="user-information__row" v-if="employee.email">
                <div class="user-information__content">
                    <div class="user-information__title">Email:</div>
                    <div class="user-information__desc" v-text="employee.email"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import employeeMixins from '../../../mixins/EmployeeData';

    export default {
        props: {
            employee: {
                type: Object,
                required: true
            }
        },
        mixins: [ employeeMixins ]
    };
</script>