<template>
    <div class="polar-graph-block">
        <div v-if="!selectedRelation">
            <select-block :selected-element="selected" :elements="getRelations" @selectElement="changeRelationType"></select-block>
        </div>
        <div v-else>
            <h3 v-text="getSelectedRelation ? getSelectedRelation.relationshipType.name : Strings.EMPTY"></h3>
        </div>
        <div v-show="existsRelations" class="chart-graph-container" style="margin: 0 auto; width: auto; position: static;">
            <svg id="nav-graph"></svg>
        </div>
        <div class="tooltip" style="opacity: 0; z-index: -1"></div>
        <div v-show="!existsRelations" class="" style="margin: 0 auto; width: auto;">
            <div v-lang.survey.relationNone></div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions, mapState } from 'vuex';
    import mixins from '../../../mixins/utils';
    import { Strings } from '../../../utils/Strings';
    import { TreeRelations } from '../../../utils/TreeRelations';

    let tree = null;

    export default {
        data() {
            return {
                Strings,
                selected: {},
                existsRelations: false
            };
        },
        props: {
            selectedRelation: {
                validator: function (val) {
                    return val === null || typeof val === 'string';
                }
            },
            employee: {
                validator: function (val) {
                    return val === null || typeof val === 'object';
                }
            }
        },
        mixins: [ mixins ],
        components: {
            SelectBlock: () => import('../../common/Select.vue')
        },
        watch: {
            selectedRelation(val) {
                this.getEmployeeRelationships({
                    employeeId: this.employee ? this.employee.id : null,
                    relationshipTypeIds: val ? [val] : this.surveyRelationshipTypeWeights.map(e => e.relationshipType.id)/*this.selected.id*/
                });
            },
            employee(val) {
                this.getEmployeeRelationships({
                    employeeId: val ? val.id : null,
                    relationshipTypeIds: this.selectedRelation ? this.selectedRelation : this.surveyRelationshipTypeWeights.map(e => e.relationshipType.id)/*this.selected.id*/
                });
            },
            employeeRelationships(val) {
                this.existsRelations = val.orElse([]).length > 0;
                if (!this.existsRelations) {
                    return;
                }
                const currentRelation = this.selectedRelation ? this.selectedRelation : this.selected.id;
                const availableEmployeeRelationships = val.orElse([]).filter(er => er.relationshipType.id === currentRelation);
                const employees = this.getUniqueParticipantAnswers(this.employee.id);
                let TreeData = {...this.employee, color: "transparent", children: []};
                availableEmployeeRelationships.forEach(er => TreeData.children.push({...this.findFirst(employees.filter(e => e.id === er.selectedEmployee.id))}));
                if (this.isEmptyObject(tree)) {
                    tree = new TreeRelations(TreeData, '#nav-graph', {width: 517, height: 500, radiusBig: 210, radiusSmall: 105, nodeMaxRadius: 25});
                    tree.init();
                } else {
                    tree.update(TreeData);
                }
            }
        },
        created() {
            this.selected = {
                id: this.findFirst(this.surveyRelationshipTypeWeights).relationshipType.id,
                name: this.findFirst(this.surveyRelationshipTypeWeights).relationshipType.name
            };
            this.getEmployeeRelationships({
                employeeId: this.employee ? this.employee.id : null,
                relationshipTypeIds: this.selectedRelation ? [this.selectedRelation] : this.surveyRelationshipTypeWeights.map(e => e.relationshipType.id)/*this.selected.id*/
            });
        },
        methods: {
            changeRelationType(relation) {
                if (relation.id === this.selected.id) {
                    return;
                }
                const newRelation = this.findFirst(this.surveyRelationshipTypeWeights.filter(r => r.id === relation.id));
                this.selected = {
                    id: newRelation.id,
                    name: newRelation.relationshipType.name
                };
                this.getEmployeeRelationships({
                    employeeId: this.employee ? this.employee.id : null,
                    relationshipTypeIds: this.surveyRelationshipTypeWeights.map(e => e.relationshipType.id)/*this.selected.id*/
                });
            },
            ...mapActions('survey', [
                'getEmployeeRelationships'
            ])
        },
        computed: {
            getSelectedRelation() {
                return this.findFirst(this.surveyRelationshipTypeWeights.filter(r => r.relationshipType.id === this.selectedRelation), null);
            },
            getRelations() {
                return this.surveyRelationshipTypeWeights.map(r => {
                    return {
                        id: r.id,
                        name: r.relationshipType.name
                    };
                });
            },
            ...mapGetters('survey', [
                'surveyRelationshipTypeWeights',
                'getUniqueParticipantAnswers'
            ]),
            ...mapState('survey', [
                'employeeRelationships'
            ])
        },
        beforeDestroy() {
            tree = null;
        }
    };
</script>