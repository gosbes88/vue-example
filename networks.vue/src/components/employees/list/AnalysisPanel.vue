<template>
    <div class="list-employees-table-wrap__found" v-if="showPanel">
        <div :class="{'found-employees': showBorder, 'found-employees-row': !showBorder}" :style="{width: widthColumn + 'px'}">

            <div class="found-employees__item">
                <div class="found-employees__content">
                    <div class="found-employees__icon found-icon" :style="{background: 'url(' + BriefCaseImg + ') no-repeat'}"></div>
                    <div class="found-employees__text" v-text="totalEmployees"></div>
                </div>
            </div>

            <div class="found-employees__item">
                <div class="found-employees__content">
                    <div class="found-employees__icon checked-icon" :style="{background: 'url(' + CheckedImg + ') no-repeat'}"></div>
                    <div class="found-employees__text found-employees__compare" v-text="compareEmployees" @click="compareSelectedEmployees"></div>
                </div>
            </div>

            <div class="found-employees__item">
                <div class="found-employees__content" :class="{'found-employees__analysis-hide': selectedEmployeesLength <= 1}">
                    <div class="found-employees__icon analysis-icon" :style="{background: 'url(' + AnalysisImg + ') no-repeat'}"></div>
                    <div class="found-employees__text found-employees__analysis"
                         @click="handleAnalysis"
                         v-lang.employees.comparative
                    ></div>
                </div>
            </div>

            <div class="found-employees__item">
                <div class="found-employees__content">
                    <div class="found-employees__icon multiple-users-icon" :style="{background: 'url(' + MultipleUsersImg + ') no-repeat'}"></div>
                    <div class="found-employees__text found-employees__group"  v-lang.employees.groupAnalysis @click="handleAnalysisGroup"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BriefCaseImg from '../../../assets/img/employees/briefcase.svg';
    import MultipleUsersImg from '../../../assets/img/multiple-users.svg';
    import CheckedImg from '../../../assets/img/checked.svg';
    import AnalysisImg from '../../../assets/img/analysis.svg';
    import mixins from '../../../mixins/utils';
    import { mapGetters } from 'vuex';

    export default {
        props: {
            showBorder: {
                type: Boolean,
                default: true
            },
            widthColumn: {
                type: Number,
                require: true
            },
            showPanel: {
                type: Boolean,
                default: false
            },
            selectedEmployeesLength: {
                type: Number,
                required: true
            },
            allSelected: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                BriefCaseImg,
                MultipleUsersImg,
                CheckedImg,
                AnalysisImg
            };
        },
        mixins: [ mixins ],
        methods: {
            compareSelectedEmployees() {
                if (!this.selectedEmployees.length) {
                    return;
                }
                //TODO: реализовать обработку события при сравнении участников, учитывать заданные фильтры
            },
            handleAnalysisGroup() {
                //TODO: реализовать обработку события при анализе группы
            },
            handleAnalysis() {
                //TODO: реализовать обработку события при сравнительном анализе
            }
        },
        computed: {
            totalEmployees() {
                const endWords = [this.translate('participants.employee'), this.translate('participants.employees1'), this.translate('participants.employees2')];
                return `${this.translate('employees.found')} ${this.getEmployeesTotalCount} ${this.declOfNum(this.getEmployeesTotalCount, endWords)}`;
            },
            compareEmployees() {
                const selected = this.allSelected ? this.getEmployeesTotalCount : this.selectedEmployeesLength;
                const endWords = [this.translate('participants.employee'), this.translate('participants.employees1'), this.translate('participants.employees2')];
                return `${this.translate('employees.compare')} ${selected} ${this.declOfNum(selected, endWords)}`;
            },
            ...mapGetters('employees', [
                'getEmployeesTotalCount'
            ])
        }
    };
</script>