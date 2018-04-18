<template>
    <router-link :to="{name: 'SummaryInformation', params: {id: employeeStatistics.employee.id}}" tag="tr" class="list-employees-table__row">
        <td class="list-employees-table__cell list-employees-table__avatar"  @click.stop="selectEmployee">
            <div class="employee-avatar-wrap">
                <div class="employee-avatar-wrap__selected" :class="{'selected': selected.includes(employeeStatistics.employee.id)}"
                     :style="{background: selected.includes(employeeStatistics.employee.id) ? 'url(' + wrapperCheckImg + ') no-repeat' : 'transparent'}"
                ></div>
                <img class="employee-avatar" :src="getAvatar" alt="">
            </div>
        </td>

        <td class="list-employees-table__cell list-employees-table__username">
            <div class="employee-block">
                <div class="employee-block__full-name" v-text="getName"></div>
                <div class="employee-block__position" v-text="employeeStatistics.employee.position"></div>
            </div>
        </td>

        <td v-for="(indicator, index) in getIndicators" :key="index" class="list-employees-table__cell">
            <div class="progress-box" v-if="existsIndicator(indicator)">
                <div class="progress-box__wrap">
                    <div class="progress-box__num" v-text="getValue(indicator)"></div>
                    <div v-if="getUniqueness(indicator) > 0 && getMaxVal(indicator)" class="progress-box__num progress-box__num--ind"
                         v-text="'(' + parseInt(getUniqueness(indicator) / getMaxVal(indicator) * 100) + '%)'"
                         :title="translate('employees.uniqueness')">
                    </div>
                </div>

                <div class="progress-box__bar" v-if="CENTRALITY_INDEX_ID !== indicator && getMaxVal(indicator)">
                    <div class="progress-box__line" :style="{width: (getValue(indicator) / getMaxVal(indicator)) * 100 + '%'}"></div>
                </div>
            </div>
            <div class="progress-box" v-else></div>
        </td>
    </router-link>
</template>

<script>
    import redImg from '../../../assets/img/information-employee/status.svg';
    import yellowImg from '../../../assets/img/information-employee/status-yellow.svg';
    import greenImg from '../../../assets/img/information-employee/status-green.svg';
    import avatarImg from '../../../assets/img/avatar-default.png';
    import wrapperCheckImg from '../../../assets/img/wrapper-check.png';
    import { mapGetters } from 'vuex';
    import { MAX_SCORE_COMPETENCE, MAX_SCORE_INDICATOR, CENTRALITY_INDEX_ID } from '../../../utils/Constants';
    import mixins from '../../../mixins/utils';

    export default {
        data() {
            return {
                redImg,
                yellowImg,
                greenImg,
                wrapperCheckImg,
                imageDefault: avatarImg,
                CENTRALITY_INDEX_ID,
                maxValues: {
                    'RATING': MAX_SCORE_INDICATOR,
                    'null': 0,
                    'default': MAX_SCORE_COMPETENCE
                }
            };
        },
        props: {
            employeeStatistics: {
                type: Object,
                default: () => { return {}; }
            },
            selected: {
                type: Array,
                default: () => []
            },
            competencies: {
                type: Array,
                default: () => []
            }
        },
        mixins: [ mixins ],
        filters: {
            getValue(ratings, indicator) {
                const currentRating = this.findFirst(ratings.filter(i => i.competenceId === indicator), {value: 0});
                return currentRating.value;
            },
            getUniqueness(ratings, indicator) {
                const currentRating = this.findFirst(ratings.filter(i => i.competenceId === indicator), {uniqueness: 0});
                return currentRating.uniqueness;
            }
        },
        methods: {
            getValue(indicator) {
                const currentRating = this.findFirst(this.employeeStatistics.ratings.filter(i => i.competenceId === indicator), {value: null});
                return parseFloat((currentRating.value || 0).toFixed(2));
            },
            getUniqueness(indicator) {
                const currentRating = this.findFirst(this.employeeStatistics.ratings.filter(i => i.competenceId === indicator), {uniqueness: null});
                return parseFloat((currentRating.uniqueness || 0).toFixed(2));
            },
            existsIndicator(indicator) {
                return this.employeeStatistics.ratings.some(r => r.competenceId === indicator && r.value !== null);
            },
            selectEmployee() {
                this.$emit("selectEmployee", this.employeeStatistics.employee.id);
            },
            getMaxVal(indicator) {
                let type = this.findFirst(this.competencies.filter(item => item.id === indicator), {type: null}).type;
                return this.maxValues[type] || this.maxValues['default'];
            }
        },
        computed: {
            getName() {
                return `${this.employeeStatistics.employee.lastName || ''} ${this.employeeStatistics.employee.name || ''}`;
            },
            getClassName() {
                return {
                    'status-green-icon': this.employeeStatistics.notice === 'GREEN',
                    'status-yellow-icon': this.employeeStatistics.notice === 'YELLOW',
                    'status-red-icon': this.employeeStatistics.notice === 'RED'};
            },
            getImage() {
                return this.employeeStatistics.notice === 'GREEN' ? this.greenImg : this.employeeStatistics.notice === 'YELLOW' ? this.yellowImg : this.redImg;
            },
            getAvatar() {
                return this.employeeStatistics.employee.avatar
                        ? `/organizations/img/employee/${this.employeeStatistics.employee.id}/avatar`
                        : `${this.imageDefault}`;
            },
            ...mapGetters('employees', [
                'getIndicators'
            ])
        }
    };
</script>