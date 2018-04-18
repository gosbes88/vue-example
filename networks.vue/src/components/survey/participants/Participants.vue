<template>
    <div>
        <div class="container-block">

            <div class="member-head">
                <div class="member-head__col-1">
                    <div class="member-head__title" v-lang.participants.select></div>
                </div>

                <div class="member-head__col-2">
                    <div class="member-head__title ml-3" v-text="getAddedEmployeesCount"></div>
                </div>
            </div>

        </div>

        <div class="container-block">
            <div class="selection-participants-main">
                <section class="selection-participants-main__col-1">
                    <div class="members-list">
                        <div class="members-list__item-1">
                            <div class="panel-search panel-search-employee js-panel-search" data-type="EMPLOYEE">
                                <search-block type="employee"
                                              :disabled="isEmptyObject(filters) && currentEmployees.length === 0"
                                              :key="1"
                                              @updateFilters="updateFilters"
                                ></search-block>
                            </div>
                        </div>
                        <div class="members-list__item-2">
                            <div v-show="currentEmployees.length > 0 || getAddedEmployees.length > 0" class="employees-panel mr-3">
                                <div class="employees-panel__column"
                                     :class="{'participants-rates-disabled': currentEmployees.length === 0 && getAddedEmployees.length > 0}"
                                     @click="addParticipants(getEmployeeIds)">
                                    <div class="add-all-wrap">
                                        <div class="add-all-wrap__col-1">
                                            <div class="add-all-icon">
                                                <i class="add-all-icon__arrow-one" :style="{background: 'url(' + arrowGreenImg + ') no-repeat'}"></i>
                                                <i class="add-all-icon__arrow-two" :style="{background: 'url(' + arrowGreenImg + ') no-repeat'}"></i>
                                            </div>
                                        </div>

                                        <div class="add-all-wrap__col-2">
                                            <div v-if="!isEmptyObject(filters)" class="add-all-block">
                                                <div v-if="isFilledOnlyDepartment(filters)" class="add-all-block__title" :key="1">
                                                    <span v-lang.participants.addFromDepartment></span>&nbsp;"<span v-text="getDepartment(filters.departmentId).name"></span>"
                                                </div>
                                                <div class="add-all-block__title" v-else v-lang.participants.addFound :key="2"></div>
                                                <div class="add-all-block__info" v-text="getParticipantsCount(currentEmployees.length)"></div>
                                            </div>

                                            <div class="add-all-block" v-else>
                                                <div class="add-all-block__title" v-lang.participants.addAll></div>
                                                <div class="add-all-block__info" v-text="getParticipantsCount(currentEmployees.length)"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="members-list__item-3 members-list__scroll-left">

                            <div v-show="currentEmployees.length === 0 && getAddedEmployees.length === 0" class="employees-not-found" v-text="getEmptyContext"></div>

                            <table class="employees-table">
                                <tbody>
                                    <tr is="employee-row"
                                        v-for="(employee, index) in currentEmployees.slice(0, 200)"
                                        :key="index"
                                        :employee="employee"
                                        @addParticipants="addParticipants"
                                    ></tr>
                                    <tr v-if="currentEmployees.length > 200" class="employees-table__row employees-table__row-added">
                                        <td>
                                            <div class="employees-table__first" v-lang.participants.first = "{count: 200}"></div>
                                        </td>
                                    </tr>
                                    <tr v-if="currentEmployees.length === 0 && getAddedEmployees.length > 0">
                                        <td class="employees-table-not-found" v-text="getEmptyContext"></td>
                                    </tr>
                                    <tr v-show="!isEmptyObject(filters) && getAddedEmployees.length > 0">
                                        <td>
                                            <div class="employees-table__added-staff">
                                                <div class="employees-table__line"></div>
                                                <h3 class="employees-table__added-staff-title" v-lang.participants.addedEmployees></h3>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr is="employee-row" class="employees-table__row-added disabled-opacity-employee"
                                        v-if="!isEmptyObject(filters)"
                                        v-for="(employee, index) in getAddedEmployees.slice(0, 30)"
                                        :key="employee.id"
                                        :employee="employee"
                                    ></tr>
                                    <tr v-show="getAddedEmployees.length > 30" class="employees-table__row employees-table__row-added">
                                        <td v-lang.participants.first = "{count: 30}"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </section>

                <section class="selection-participants-main__col-2">

                    <div class="members-list">
                        <div class="members-list__item-1">
                            <div class="panel-search-participant">
                                <search-block type="participant"
                                              :disabled="addedEmployees.length === 0"
                                              :key="2"
                                              @updateFilters="updateFilters"
                                ></search-block>
                            </div>
                        </div>

                        <div class="members-list__item-2">
                            <div v-show="currentParticipants.length > 0" class="employees-panel ml-3">

                                <div class="employees-panel__col-1" :class="{'disabled': !removableParticipantsCount}" @click="removeParticipants(participants.filter(p => !p.startedSurvey).map(p => p.id))">

                                    <div class="remove-employees-block">
                                        <div class="remove-employees-block__col-1">
                                            <div class="remove-employees-icon">
                                                <i class="remove-employees-icon__arrow-one" :style="{background: 'url(' + arrowRedImg + ') no-repeat'}"></i>
                                                <i class="remove-employees-icon__arrow-two" :style="{background: 'url(' + arrowRedImg + ') no-repeat'}"></i>
                                            </div>
                                        </div>

                                        <div class="remove-employees-block__col-2">
                                            <div class="remove-all-employees">
                                                <div v-if="isEmptyObject(filterParticipants)" class="remove-all-employees__title" :key="0" v-lang.participants.deleteAll></div>
                                                <div class="remove-all-employees__title" :key="1" v-lang.participants.deleteAllFound v-else></div>

                                                <div class="remove-all-employees__num" v-text="getParticipantsCount(removableParticipantsCount)"></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="employees-panel__col-2">

                                    <div v-if="!isEmptyObject(existsEmployeeConnections.orElse({}))" class="quickly-add-block">
                                        <div class="quickly-add-block__col-1">
                                            <added-connections class="tooltip-quickly-add"
                                                               :icon-class-name="'quickly-add-icon'"
                                                               :employee-ids="getParticipateEmployeesIds"
                                                               :consumer="updateParticipantFilters"
                                            ></added-connections>
                                        </div>

                                        <div class="quickly-add-block__col-2">
                                            <div class="quickly-add">
                                                <div class="quickly-add__title" v-lang.participants.addFast></div>
                                                <div class="quickly-add__info" v-lang.participants.specificType></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="members-list__item-3 members-list__scroll-right">
                            <div class="members-list__selected">
                                <table v-if="currentParticipants.length > 0" class="employees-delete__table table-default">
                                    <tbody>
                                    <tr is="participant-row"
                                        v-for="(participant, index) in currentParticipants"
                                        :key="index"
                                        :participant="participant"
                                        :existsEmployeeConnections="existsEmployeeConnections.orElse({})[participant.id]"
                                        :consumer="updateParticipantFilters"
                                        @removeParticipants="removeParticipants"
                                    ></tr>
                                    </tbody>
                                </table>

                                <div v-else-if="currentParticipants.length === 0 && !isEmptyObject(filterParticipants)" class="employees-not-found" v-lang.participants.notFound></div>

                                <div class="empty-list" v-else>
                                    <i class="empty-list__icon arrow-left-mini-light-icon anim anim-icon" :style="{background: 'url(' + arrowLeftLightImg + ') no-repeat'}"></i>
                                    <span v-lang.participants.selectLeft></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>

        <div class="panel-fixed">
            <div class="container-block">
                <div class="panel-fixed__content">
                    <div class="panel-fixed__col">
                        <router-link :to="linkToBack" class="text-link anim-hover-left">
                            <i class="link-back__icon arrow-left-green-mini-icon anim anim-icon" :style="{background: 'url(' + leftGreenImg + ') no-repeat'}"></i>
                            <span class="text-link__prev" v-lang.participants.back></span>
                        </router-link>
                    </div>

                    <div class="panel-fixed__col">
                        <router-link :to="linkToNext" v-if="addedEmployees.length > 0">
                            <button class="text-link pull-right anim-hover-right button-link">
                                <span v-lang.next></span>
                                <i class="arrow-right-green-mini-icon text-link__icon-arrow-right anim anim-icon" :style="{background: 'url(' + rightGreenImg + ') no-repeat'}"></i>
                            </button>
                        </router-link>

                        <a href="javascript: void(0);" class="text-link button-gray--disabled" v-else >
                            <span class="text-link__next" v-lang.next></span>
                            <i class="arrow-right-mini-light-icon anim anim-icon" :style="{background: 'url(' + rightGrayImg + ') no-repeat'}"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '../../../mixins/utils';
    import arrowGreenImg from '../../../assets/img/arrow-mini-right-green.svg';
    import arrowRedImg from '../../../assets/img/arrow-mini-left-red.svg';
    import arrowLeftLightImg from '../../../assets/img/arrow-mini-left-light.svg';
    import rightGrayImg from '../../../assets/img/arrow-mini-right-gray-light.svg';
    import rightGreenImg from '../../../assets/img/arrow-mini-right-green.svg';
    import leftGreenImg from '../../../assets/img/arrow-mini-left-green.svg';
    import { mapActions, mapGetters, mapState} from 'vuex';
    import { fillFormData } from '../../../utils/Constants';

    export default {
        name: "Participants",
        data() {
            return {
                filters: {},
                filterParticipants: {},
                participants: [],
                tempEmployees: [],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    before(request) {
                        if (this.previousRequest) {
                            this.previousRequest.abort();
                        }
                        this.previousRequest = request;
                    }
                },
                arrowGreenImg,
                arrowRedImg,
                arrowLeftLightImg,
                rightGrayImg,
                rightGreenImg,
                leftGreenImg
            };
        },
        head: {
            title: function () {
                return {
                    inner: this.translate('participants.title')
                }
            }
        },
        mixins: [ mixin ],
        components: {
            SearchBlock: () => import('./SearchBlock.vue'),
            AddedConnections: () => import("./AddedConnections.vue"),
            ParticipantRow: () => import("./ParticipantRow.vue"),
            EmployeeRow: () => import("./EmployeeRow.vue")
        },
        created() {
            (async () => {
                await this.getEmployees();
                if (!this.employees.orElse([]).length) {
                    window.location = window.location.origin + "/organizations/employees/batch/?surveyId=" + this.survey.orElse({}).id;
                }
                await Promise.all([this.getSurveyData(), this.getDepartments(), this.getPositions()]);
                await this.existsEmployeesConnections(this.getParticipateEmployeesIds);
                this.participants = this.addedEmployees;
                this.tempEmployees = this.employees.orElse([]).filter(e => !this.getParticipateEmployeesIds.includes(e.id));
            })();
        },
        methods: {
            updateFilters(filters, type) {
                type === 'employee'
                        ? this.updateEmployeeFilters(filters)
                        : this.updateParticipantFilters(filters);
            },
            async updateEmployeeFilters(filters) {
                try {
                    this.filters = filters || this.filters;
                    if (this.isEmptyObject(this.filters)) {
                        await this.getEmployees();
                        this.tempEmployees = this.employees.orElse([]).filter(e => !this.getParticipateEmployeesIds.includes(e.id));
                    } else {
                        let response = await this.getEmployeesByFilters(this.filters);
                        this.tempEmployees  = response.data;
                    }
                } catch(e) {
                    console.error(e);
                }
            },
            updateParticipantFilters(filters) {
                this.filterParticipants = filters || this.filterParticipants;
                if (this.isEmptyObject(this.filterParticipants)) {
                    this.participants = this.addedEmployees;
                } else {
                    this.getParticipantsByFilters(this.filterParticipants);
                }
            },
            async getParticipantsByFilters(filters) {
                try {
                    let response = await this.getEmployeesByFilters(filters);
                    response = response.data.map(employee => employee.id);
                    this.participants = this.addedEmployees.filter(p => response.includes(p.employeeId));
                } catch(e) {
                    console.error(e);
                }
            },
            async getEmployeesByFilters(filters) {
                let { filter, position, departmentId } = filters;
                let obj = {filter, position, departmentId, employeeIds: [], includeDismissed: false};
                return await this.$http.post('/organizations/service/rest/employees/search', fillFormData(obj), this.headers);
            },
            async removeParticipants(participantIds) {
                await this.changeParticipants({isAdded: false, participantIds});
                await this.updateTempEmployees();
                this.participants = this.isEmptyObject(this.filterParticipants)
                        ? this.addedEmployees
                        : this.participants.filter(p => !participantIds.includes(p.id));
            },
            async updateTempEmployees() {
                if (this.isEmptyObject(this.filters)) {
                    this.tempEmployees = this.employees.orElse([]).filter(e => !this.getParticipateEmployeesIds.includes(e.id));
                } else {
                    let response = await this.getEmployeesByFilters(this.filters);
                    this.tempEmployees = response.data;
                }

                this.tempEmployees.sort(this.sortEmployees);
            },
            async addParticipants(participantIds) {
                await this.changeParticipants({isAdded: true, participantIds});

                if (this.isEmptyObject(this.filterParticipants)) {
                    this.participants = this.addedEmployees;
                } else {
                    await this.getParticipantsByFilters(this.filterParticipants);
                }

                await this.updateTempEmployees();
            },
            sortEmployees(employee1, employee2) {
                const [lastName1, lastName2, name1, name2] = [
                    employee1.lastName.toLowerCase(),
                    employee2.lastName.toLowerCase(),
                    employee1.name ? employee1.name.toLowerCase() : "",
                    employee2.name ? employee2.name.toLowerCase() : ""
                ];
                if (lastName1 === lastName2) {
                    if (name1 > name2) {
                        return 1;
                    } else if (name1 < name2) {
                        return -1;
                    }
                    return 0;
                }
                if (lastName1 > lastName2) {
                    return 1;
                }
                return -1;
            },
            getParticipantsCount(size) {
                let wordEnd = [this.translate("participants.employee"), this.translate("participants.employees1"), this.translate("participants.employees2")];
                return `${size} ${this.declOfNum(size, wordEnd)}`;
            },
            isFilledOnlyDepartment(filters) {
                if (typeof filters !== "object" || Object.keys(filters).length === 0) {
                    return false;
                }
                const filledCount = filters => {
                    let count = 0;
                    for (let key in filters) {
                        if (filters[key]) {
                            ++count;
                        }
                    }
                    return count;
                };
                return Object.keys(filters).some(field => field === 'departmentId' && filters[field]) ? filledCount(filters) === 1 : false;
            },
            ...mapActions('survey', [
                'getEmployees',
                'getSurveyData',
                'changeParticipants',
                'getDepartments',
                'getPositions',
                'existsEmployeesConnections',
                'getEmployeeConnections'
            ])
        },
        computed: {
            removableParticipantsCount() {
                return (this.isEmptyObject(this.filterParticipants) ? this.addedEmployees : this.participants).filter(p => !p.startedSurvey).length;
            },
            linkToBack() {
                return this.survey.orElse({}).statusType === 'NEW'
                        ? {name: 'SurveySettings', params: {id: this.$route.params.id}}
                        : {name: 'ParticipantsPage', params: {id: this.$route.params.id}};
            },
            linkToNext() {
                return this.survey.orElse({}).statusType === 'NEW'
                        ? {name: 'SurveyNew', params: {id: this.$route.params.id}}
                        : {name: 'ParticipantsPage', params: {id: this.$route.params.id}};
            },
            currentEmployees() {
                return this.tempEmployees.filter(employee => !this.getParticipateEmployeesIds.includes(employee.id));
            },
            currentParticipants() {
                return this.employees.orElse([]).filter(employee => this.getParticipantIds.includes(employee.id));
            },
            getParticipantIds() {
                return this.participants.map(p => p.employeeId);
            },
            getEmployeeIds() {
                return this.tempEmployees.map(employee => employee.id);
            },
            getAddedEmployees() {
                return !this.isEmptyObject(this.filters)
                        ? this.tempEmployees.filter(employee => this.getParticipateEmployeesIds.includes(employee.id))
                        : [];
            },
            getAddedEmployeesCount() {
                if (!this.addedEmployees.length) {
                    return this.translate("participants.notAdded");
                }
                let wordEnd = [this.translate("participants.employees1"), this.translate("participants.employees2"), this.translate("participants.employees2")];
                return `${this.translate("participants.selectedNow")} ${this.addedEmployees.length} ${this.declOfNum(this.addedEmployees.length, wordEnd)}`;
            },
            getEmptyContext() {
                return this.isEmptyObject(this.filters)
                        ? this.translate("participants.allAdded")
                        : this.translate("participants.notFound");
            },
            ...mapGetters('survey', [
                'getParticipateEmployeesIds',
                'addedEmployees',
                'getDepartment'
            ]),
            ...mapState('survey', [
                'survey',
                'employees',
                'existsEmployeeConnections',
                'employeeConnectionsData'
            ])
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    .disabled {
        filter: grayscale(100%);
        pointer-events: none;
    }
</style>