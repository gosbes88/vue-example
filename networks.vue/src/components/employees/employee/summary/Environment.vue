<template>
    <div class="environment-graph">
        <div class="environment-graph__col-1">
            <div class="environment-graph__row" v-for="(item, index) in relationColor" :key="index">
                <div class="environment-graph__item">
                    <div class="environment-graph__other-links-icon" :style="{'border': `1px solid ${item}`}"></div>
                    <div class="environment-graph__text" v-text="relationNames[index]"></div>
                </div>
            </div>
        </div>

        <div class="environment-graph__col-2">
            <svg id="relation"></svg>
        </div>
        <div class="tooltip" style="opacity: 0;"></div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    import avatarImg from '../../../../assets/img/avatar-default.png';
    import { TreeRelations } from '../../../../utils/TreeRelations';
    import { RELATIONS_MAX_COUNT } from '../../../../utils/Constants';
    import mixins from '../../../../mixins/utils';

    let tree = null;

    export default {
        data() {
            return {
                avatarImg,
                relationColor: {},
                relationNames: {}
            };
        },
        mixins: [ mixins ],
        watch: {
            employeeRelationships(val) {
                if (!val.orElse([]).length) {
                    return;
                }
                this.drawTree();
            }
        },
        computed: {
            ...mapState('employees', [
                'employeeRating',
                'employeeRelationships'
            ]),
            ...mapGetters('employees', [
                'getEmployee'
            ])
        },
        methods: {
            drawTree() {
                if (!tree) {
                    tree = new TreeRelations(this.fillTreeData(), '#relation', {width: 900, height: 600, radiusBig: 400, radiusSmall: 200});
                    tree.remove().init();
                } else {
                    tree.update(this.fillTreeData())
                }
            },
            fillTreeData() {
                let relationsByEmployee = this.fillRelationsByEmployee(this.employeeRelationships);
                let relationsRatings = this.fillRelationsRating(relationsByEmployee);
                this.fillColorsByRelations(relationsRatings);
                let treeData = {...this.getEmployee, children: [], color: 'transparent'};
                relationsByEmployee.forEach((val, key, map) => {
                    if (this.relationColor[val.relationshipType.id]) {
                        treeData.children.push({...val.selectedEmployee, color: this.relationColor[val.relationshipType.id]});
                    }
                });
                return treeData;
            },
            fillColorsByRelations(relationsRatings) {
                const relationIds = Object.keys(relationsRatings).sort();
                if (relationIds.length <= RELATIONS_MAX_COUNT) {
                    relationIds.forEach((relation, index) => this.makeColor(index + 1, relationIds.length, relation));
                } else {
                    let relationByAverageSum = relationIds.map(relation => {
                        const item = relationsRatings[relation];
                        return { [relation]: item.sum / item.count };
                    });
                    relationByAverageSum = this.getBestRelations(relationByAverageSum);
                    relationByAverageSum.forEach((item, index) => this.makeColor(index + 1, relationByAverageSum.length, Object.keys(item)[0]));
                }
                this.sortObjectByKeys(this.relationColor);
            },
            fillRelationsRating(relationsByEmployee) {
                let relationsRatings = {};
                relationsByEmployee.forEach((val, key, map) => {
                    if (relationsRatings[val.relationshipType.id]) {
                        relationsRatings[val.relationshipType.id] = {
                            sum: relationsRatings[val.relationshipType.id].sum + val.weight,
                            count: relationsRatings[val.relationshipType.id].count + 1
                        };
                    } else {
                        relationsRatings[val.relationshipType.id] = {sum: val.weight, count: 1};
                    }
                    /**
                     * Запись названия связей для отображения в легенде графика
                     */
                    this.relationNames = {...this.relationNames, [val.relationshipType.id]: val.relationshipType.name};
                });
                return relationsRatings;
            },
            fillRelationsByEmployee(val) {
                let relationsByEmployee = new Map();
                val.orElse([]).forEach(er => {
                    if (relationsByEmployee.has(er.selectedEmployee.id) && relationsByEmployee.get(er.selectedEmployee.id).weight > er.weight) {
                        return;
                    }
                    relationsByEmployee.set(er.selectedEmployee.id, er)
                });
                return relationsByEmployee;
            },
            getBestRelations(relations) {
                return relations.sort((a, b) => a.relation > b.relation).slice(0, RELATIONS_MAX_COUNT);
            },
            makeColor: function (colorNum, count, relation){
                if (count < 1) {
                    count = 1;
                }
                const hue = colorNum * (360 / count) % 360;
                this.relationColor = {...this.relationColor, [relation]: "hsl(" + hue.toFixed() + ", 50%, 50%)"};
            }
        },
        beforeDestroy() {
            tree = null;
        }
    };
</script>