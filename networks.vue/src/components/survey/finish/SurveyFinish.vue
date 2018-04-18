<template>
    <div>
        <div class="container-default">
            <div class="breadcrumb">
                <router-link class="breadcrumb-link anim-hover-left" :to="{name: 'Manager'}">
                    <i class="breadcrumb-link__icon arrow-left-dark-small-icon anim anim-icon" :style="{background: 'url(' + backImg + ') no-repeat'}"></i>
                    <span v-lang.survey.surveys></span>
                </router-link>
            </div>
        </div>

        <div class="container-default">
            <div class="container-small">
            <h1 class="text-center mb-2">
                <textarea class="inp-textarea inp-textarea--not-line project-title inp-edit text-center" rows="1"
                          :class="{'project-text-disabled': getSurvey.statusType && getSurvey.statusType !== 'NEW'}"
                          :placeholder="translate('survey.noSummary')"
                          :value="getSurvey.name"
                          @input="changeName"
                          v-autosize="getSurvey.name"
                ></textarea>
            </h1>

            <button class="project__button button-circle" :class="buttonClass" @click="buttonHandler">
                <div class="project__text-center" v-if="getSurvey.statusType === 'NEW'">
                    <div class="svg-play-icon" :style="{background: getSurvey.validationError ? 'url(' + disabledImg + ')' : 'url(' + playImg + ')'}"></div>
                    <div class="button-circle__text" v-lang.survey.start></div>
                </div>
                <div class="project__text-center" v-else-if="getSurvey.statusType === 'ACTIVE'">
                    <div class="project__svg-stop-icon svg-stop-icon" :style="{background: 'url(' + stopImg + ')'}"></div>
                    <div class="button-circle__text" v-lang.survey.stop></div>
                </div>
                <div class="project__text-center" v-else-if="getSurvey.statusType === 'COMPLETED'">
                    <a href="javascript: void(0);" >
                        <div class="evalution-icon" :style="{background: 'url(' + totalsImg + ')'}"></div>
                        <div class="button-evaluation__text" v-lang.survey.totals></div>
                    </a>
                </div>
            </button>

            <div v-if="getSurvey.validationError" class="project__text-error">
                <div v-lang.validationError></div>
                <div v-if="getSurvey.validationError === 'PARTICIPANT_COUNT'">
                    <span v-lang.validationErrorParticipantCount1></span>
                    <a href="/organizations#licenses" v-lang.validationErrorParticipantCount2></a>
                    <span v-lang.validationErrorParticipantCount3></span>
                </div>
                <div v-else-if="getSurvey.validationError === 'EMPTY_PARTICIPANTS'">
                    <span v-lang.validationErrorEmptyParticipants></span>
                </div>
            </div>

            <div class="inp-row" v-if="getSurvey.statusType === 'NEW' || getSurvey.appeal">
                <textarea class="project-desc__content inp-textarea" rows="1"
                          :class="{'project-text-disabled': getSurvey.statusType && getSurvey.statusType !== 'NEW'}"
                          :placeholder="translate('survey.noAppeal')"
                          :value="getSurvey.appeal"
                          @input="changeAppeal"
                ></textarea>
                <label class="inp-label inp-label--top" v-lang.survey.hello></label>
            </div>

            <div class="project-date">   <!--:class="{'project-text-disabled': getSurvey.statusType && getSurvey.statusType !== 'NEW'}"-->
                <div class="project-date__group" v-if="getSurvey.statusType === 'NEW'">
                    <input-date className="project-creation__inp-date-beginning"
                                :label="translate('survey.dateStart')"
                                :value="getDate(getSurvey.startDate) || ''"
                                :locale="getSelectOrganization.locale"
                                :min-date="'today'"
                                :max-date="endDateForMin"
                                @updateDate="updateDateStart"
                    ></input-date>

                    <input-date className="project-creation__inp-date-expiration"
                                :label="translate('survey.dateEnd')"
                                :value="getDate(getSurvey.endDate) || ''"
                                :locale="getSelectOrganization.locale"
                                :min-date="startDateForMax"
                                :max-date="''"
                                @updateDate="updateDateEnd"
                    ></input-date>
                </div>

                <div class="project-date__group" v-else>
                    <div class="project-date__col">
                        <div class="project-date__title" v-lang.survey.dateStart></div>
                        <div class="project-date__value" v-text="getDateText(getSurvey.startDate)"></div>
                    </div>

                    <div class="project-date__col">
                        <div class="project-date__title" v-lang.survey.dateEnd></div>
                        <div class="project-date__value" v-text="getDateText(getSurvey.endDate)"></div>
                    </div>
                </div>

                <div class="project-date__col">
                    <div class="project-date__title" v-lang.survey.days></div>
                    <div class="project-date__value" v-text="duration"></div>
                </div>
            </div>

            <div class="selected-profile mb-5">
                <h3 class="selected-profile__title" v-lang.survey.selected></h3>

                <ul class="selected-profile__list">
                    <li v-for="(question, index) in getSurvey.questions" :key="index" v-text="question.text"></li>
                </ul>
            </div>

            <statistics-block v-if="getSurvey.statusType && getSurvey.statusType !== 'NEW'"></statistics-block>

            <div class="mb-2">
                <a class="button-add-members" v-if="getSurvey.statusType === 'NEW'"  href="javascript: void(0);">
                    <i class="member-icon mr-1" :style="{background: 'url(' + memberImg + ')'}"></i>
                    <span class="text-link" v-text="getParticipantsCount"></span>
                </a>
                <router-link class="button-add-members" :to="{name: 'ParticipantsPage', params: {id: $route.params.id}}" v-else-if="getSurvey.statusType && getSurvey.statusType !== 'NEW'">
                    <i class="member-icon mr-1" :style="{background: 'url(' + memberImg + ')'}"></i>
                    <span class="text-link" v-text="getParticipantsCountTitle(addedEmployees.length)"></span>
                </router-link>
            </div>

            <div class="creation-project-footer">
                <div v-if="getSurvey.statusType === 'NEW'" class="creation-project-footer__col anim-hover-left">
                    <router-link :to="{name: 'SurveySettings', params: {id: $route.params.id}}" v-lang.survey.change></router-link>
                </div>
                <message v-else-if="getSurvey.statusType === 'ACTIVE'"></message>
            </div>
        </div>
        </div>

    </div>
</template>

<script>
    import mixin from '../../../mixins/utils';
    import backImg from '../../../assets/img/arrow-left-dark-gray.svg';
    import playImg from '../../../assets/img/play-green.svg';
    import disabledImg from '../../../assets/img/play-gray.svg';
    import memberImg from '../../../assets/img/member.svg';
    import arrowLeftImg from '../../../assets/img/arrow-mini-left-green.svg';
    import stopImg from '../../../assets/img/stop.svg';
    import totalsImg from '../../../assets/img/evaluation.svg';
    import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';

    export default {
        name: "SurveyFinish",
        data() {
            return {
                timeout: null,
                backImg,
                playImg,
                memberImg,
                arrowLeftImg,
                stopImg,
                totalsImg,
                disabledImg,
                classNames: {
                    'ACTIVE': 'button-circle--stop',
                    'COMPLETED': 'button-evaluation',
                    'true': 'button-circle--disabled',
                    'false': 'button-circle--start'
                }
            };
        },
        head: {
            title: function () {
                return {
                    inner: this.getSurvey.name || this.translate('survey.start')
                }
            }
        },
        components: {
            InputDate: () => import('./InputDate.vue'),
            StatisticsBlock: () => import('./StatisticsBlock.vue'),
            Message: () => import('./Message.vue')
        },
        mixins: [mixin],
        created() {
            (async () => {
                this.fillSurvey({value: null});
                this.$store.commit('setFooterView', true);
                await this.getSurveyData();
                if (!this.survey.orElse({}).lastStage || this.survey.orElse({}).lastStage !== 'SurveyNew') {
                    this.fillSurvey({value: {...this.survey.orElse({}), lastStage: "SurveyNew"}});
                    await this.saveSurvey(true);
                }
            })();
        },
        computed: {
            getSurvey() {
                return this.survey.orElse({});
            },
            startDateForMax() {
                let date = this.getSurvey.startDate
                        ? new Date(this.getSurvey.startDate)
                        : new Date();
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().replace(/^([0-9])$/, '0$1')}-${(date.getDate() + 1).toString().replace(/^([0-9])$/, '0$1')}`;
            },
            endDateForMin() {
                let date = this.getSurvey.endDate ? new Date(this.getSurvey.endDate) : null;
                return date ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().replace(/^([0-9])$/, '0$1')}-${(date.getDate() - 1).toString().replace(/^([0-9])$/, '0$1')}` : '';
            },
            getParticipantsCount() {
                return this.getSurvey.participants && this.getSurvey.participants.length
                        ? this.translate('survey.participants', {count: `${this.getSurvey.participants.length}`})
                        : this.translate('survey.noParticipants');
            },
            buttonClass() {
                if (this.getSurvey.validationError != null) {
                    return this.classNames[true];
                }

                return this.classNames[this.getSurvey.statusType]
                        ? this.classNames[this.getSurvey.statusType]
                        : this.classNames[this.isEmptyName];
            },
            duration() {
                if (this.getSurvey.statusType === 'NEW') {
                    const oneDay = 1000 * 60 * 60 * 24;
                    return this.getSurvey.startDate && this.getSurvey.endDate
                            ? (new Date(this.getSurvey.endDate) - new Date(this.getSurvey.startDate)) / oneDay
                            : this.translate('survey.noDays');
                } else {
                    const difference = (this.getSurvey.endDate ? new Date(this.getSurvey.endDate) : new Date()) - new Date(this.getSurvey.startDate);
                    const diffSeconds = parseInt(difference / 1000 % 60);
                    const diffMinutes = parseInt(difference / (60 * 1000) % 60);
                    const diffHours = parseInt(difference / (1000 * 60 * 60) % 24);
                    const diffDays = parseInt(difference / (1000 * 60 * 60 * 24));
                    return `${diffDays} д. ${diffHours} ч. ${diffMinutes} м. ${diffSeconds} с.`;
                }
            },
            isEmptyName() {
                return !Boolean(this.getSurvey.name);
            },
            ...mapGetters([
                'getSelectOrganization'
            ]),
            ...mapGetters('survey', [
                'addedEmployees'
            ]),
            ...mapState('survey', [
                'survey'
            ])
        },
        methods: {
            getDateText(date) {
                return date
                    ?  `${new Date(date).getDate()} ${this.translate('month.full' + new Date(date).getMonth())} ${new Date(date).getFullYear()}`
                    : this.translate('survey.noDate');
            },
            getDate(value) {
                let date = value || '';
                return date
                    ? date.substr(0, 10)
                    : date;
            },
            changeName($event) {
                this.setSurveyName($event.target.value.slice(0, 256));
                this.title = $event.target.value.slice(0, 256);
                this.$emit('updateHead');
                this.saveSurvey();
            },
            changeAppeal($event) {
                this.update({type: 'APPEAL', value: $event.target.value});
            },
            updateDateEnd(value) {
                this.update({type: 'END_DATE', value: `${value}T00:00:00Z`});
            },
            updateDateStart(value) {
                this.update({type: 'START_DATE', value: `${value}T00:00:00Z`});
            },
            update(data) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.changeField(data);
                    this.saveSurvey();
                }, 500);
            },
            buttonHandler() {
                const status = this.getSurvey.statusType;
                if (status === "NEW") {
                    this.startSurvey();
                } else if (status === "ACTIVE") {
                    this.stopSurvey();
                } else if (status === "COMPLETED") {
                    this.$router.push({name: 'SurveyResults', params: {id: this.$route.params.id}});
                }
            },
            getParticipantsCountTitle(participantsCount) {
                return `${participantsCount} ${this.declOfNum(participantsCount, [this.translate('survey.participant'), this.translate('survey.participants1'), this.translate('survey.participants2')])}`;
            },
            ...mapActions('survey', [
                'getSurveyData',
                'saveSurvey',
                'startSurvey',
                'stopSurvey'
            ]),
            ...mapMutations('survey', [
                'setSurveyName',
                'changeField',
                'fillSurvey'
            ])
        }
    };
</script>

<style lang="less" scoped>
    .date-block {
        margin-right: 20px;
    }
</style>