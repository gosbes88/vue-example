<template>
    <div>
        <div class="tooltip-add-also__arrow"></div>

        <div class="tooltip-add-also__content js-added-employees-content">

            <div class="tooltip-add-also__title" v-text="getTitle"></div>

            <div v-for="(element, key, index) in connections" v-if="element" class="tooltip-add-also__row" :key="index">
                <div class="checkbox-block">
                    <input class="inp-checkbox" :id="key" type="checkbox" :value="key" @change="addParticipants"/>
                    <label class="checkbox-label" :for="key" v-text="labels[key][(ids.length > 1) * 1] + ' (' + element + ')'"></label>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                labels: {
                    DIRECT_MANAGER: [],
                    DIRECT_SUBORDINATES: [],
                    ALL_SUBORDINATES: [],
                    COWORKERS: []
                }
            };
        },
        created() {
            this.labels = {
                DIRECT_MANAGER: [this.translate("participants.addManager"), this.translate("participants.addManagers")],
                DIRECT_SUBORDINATES: [this.translate("participants.addSubordinates"), this.translate("participants.addSubordinates")],
                ALL_SUBORDINATES: [this.translate("participants.addAllSubordinates"), this.translate("participants.addAllSubordinates")],
                COWORKERS: [this.translate("participants.addCoworkers2"), this.translate("participants.addCoworkers1")]
            };
        },
        props: {
            connections: {
                type: Object,
                default: () => {return {};}
            },
            ids: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            getTitle() {
                return this.ids.length > 1
                        ? this.translate("participants.addAllAlso")
                        : this.translate("participants.addAlso");
            }
        },
        methods: {
            addParticipants($event) {
                let type = $event.target.value;
                $event.target.checked = false;
                this.$emit('addParticipants', {employeeIds: this.ids, type});
            }
        }
    };
</script>