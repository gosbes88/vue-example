<template>
    <div class="tooltip-add-also">
        <div class="ellipses-icon" :style="{background: 'url(' + moreImg + ')'}" :class="iconClassName" @click.stop="showConnections">
        </div>

        <div class="tooltip-add-also__container" :class="showOrHide">
            <connections-tooltip :connections="connections"
                                 :ids="employeeIds"
                                 @addParticipants="addParticipants"
            ></connections-tooltip>
        </div>
    </div>
</template>

<script>
    import mixin from "../../../mixins/utils";
    import moreImg from '../../../assets/img/questions/more.svg';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                connections: {},
                isViewed: false,
                moreImg
            };
        },
        props: {
            iconClassName: {
                type: String,
                default: ""
            },
            employeeIds: {
                type: Array,
                default: () => []
            },
            consumer: {
                type: Function,
                required: true
            }
        },
        components: {
            ConnectionsTooltip: () => import("./ConnectionsTooltip.vue")
        },
        mixins: [ mixin ],
        computed: {
            showOrHide() {
                return {
                    'hide-anim': this.isEmptyObject(this.connections) || !this.isViewed,
                    'show-anim': !this.isEmptyObject(this.connections) && this.isViewed
                };
            },
            ...mapGetters('survey', [
                'getParticipateEmployeesIds'
            ])
        },
        created() {
            this.$bus.$on("hide", data => this.isViewed = data);
            document.addEventListener("click", this.hide.bind(this));
        },
        beforeDestroy() {
            document.removeEventListener("click", this.hide.bind(this));
        },
        methods: {
            showConnections() {
                let formData = new FormData();
                this.employeeIds.forEach(id => formData.append('employeeIds', id));
                this.getParticipateEmployeesIds.forEach(id => formData.append('addedEmployeeIds', id));

                this.$http.post('/organizations/service/rest/employees/connections/data', formData, {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'})
                        .then(response => response.body)
                        .then(connections => {
                            this.connections = connections;
                            const oldValue = this.isViewed;
                            this.$bus.$emit('hide', false);
                            this.isViewed = !oldValue;
                        });
            },
            hide() {
                this.$bus.$emit('hide', false);
            },
            async addParticipants(data) {
                this.$bus.$emit('hide', false);
                await this.addEmployeesByType(data);
                this.consumer();
            },
            ...mapActions('survey', [
                'addEmployeesByType'
            ])
        }
    };
</script>