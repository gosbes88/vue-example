<template>
    <div v-else-if="getSurvey.statusType === 'ACTIVE'" class="creation-project-footer__col">
        <a class="message-participants" href="javascript:void(0);" @click="handleMessageTooltip">
            <div class="message-participants__icon" :style="{background: 'url(' + messageImg + ') no-repeat'}"></div>
            <div v-lang.survey.sendMessage></div>
        </a>
        <div class="send-letters">
            <div class="send-letters__content" :class="{'send-letters__content-show': isShowMessageTooltip}">
                <div class="send-letters__arrow"></div>

                <div class="send-letters__close close-block-icon" :style="{background: 'url(' + CloseImg + ') no-repeat'}" @click="hideTooltip"></div>

                <h3 class="send-letters__title" v-lang.survey.sendMessage></h3>

                <div class="tooltip-content__text">
                    <span v-lang.survey.messageText1></span>
                    <input class="tooltip-message__inp-num inp-num" type="number" min="0" max="100" v-model="percent" required>%
                    <span v-lang.survey.messageText2></span>
                    <div class="js-count-participants" v-text="getParticipantsCountTitle"></div>
                    <textarea class="project-creation__textarea inp-textarea mt-2"
                              rows="1"
                              v-model="message"
                              v-autosize ="message.text">
                    </textarea>
                </div>

                <div class="mt-3">
                    <a class="send-letters__send following-link js-send-notification" href="javascript:void(0);">
                        <span class="following-link__active" v-if="notSent" @click="sendMessage">
                            <span class="following-link__text" v-lang.survey.send></span>
                            <i class="following-link__icon anim-icon" :style="{background: 'url(' + GreenImg + ') no-repeat'}"></i>
                        </span>

                        <span v-else>
                            <span class="following-link__text js-sent-click text-link-disabled" v-lang.survey.sent></span>
                            <i class="following-link__icon anim-icon" :style="{background: 'url(' + GrayImg + ') no-repeat'}"></i>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CloseImg from '../../../assets/img/close.svg';
    import GreenImg from '../../../assets/img/arrow-mini-right-green.svg';
    import GrayImg from '../../../assets/img/arrow-mini-right-gray.svg';
    import messageImg from '../../../assets/img/send-message.svg';
    import mixins from '../../../mixins/utils';
    import { mapGetters } from 'vuex';
    import { fillFormData, FORM_HEADERS } from '../../../utils/Constants';

    export default {
        data() {
            return {
                CloseImg,
                messageImg,
                GreenImg,
                GrayImg,
                notSent: true,
                count: 0,
                percent: 10,
                message: "",
                isShowMessageTooltip: false
            };
        },
        mixins: [ mixins ],
        watch: {
            percent(val) {
                this.count = this.getSuitableEmployees(val).length;
            }
        },
        methods: {
            handleMessageTooltip() {
                this.isShowMessageTooltip = !this.isShowMessageTooltip;
                if (!this.isShowMessageTooltip) {
                    return;
                }
                this.count = this.getSuitableEmployees().length;
            },
            getSuitableEmployees(val = this.percent) {
                return this.addedEmployees.filter(p => p.answers && p.answers.length / this.surveyQuestions.length * 100 < val);
            },
            sendMessage() {
                this.notSent = false;
                const formData = fillFormData({message: this.message, employeesIds: this.getSuitableEmployees().map(p => p.employeeId)});
                this.sleep(500)
                        .then(() => this.$http.post(`/networks/service/rest/m/surveys/${this.$route.params.id}/notify`, formData, FORM_HEADERS))
                        .then(response => {
                            if (response.ok) {
                                this.notSent = true;
                                this.percent = 10;
                                this.count = this.getSuitableEmployees().length;
                                this.message = "";
                                this.hideTooltip();
                            }
                        })
                        .catch(error => console.error(error));
            },
            sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            hideTooltip() {
                this.isShowMessageTooltip = false;
            }
        },
        computed: {
            getParticipantsCountTitle() {
                return `(${this.translate('It')} ${this.count} ${this.declOfNum(this.count, [this.translate('survey.participant'), this.translate('survey.participants1'), this.translate('survey.participants2')])})`;
            },
            ...mapGetters('survey', [
                'surveyQuestions',
                'addedEmployees'
            ])
        }
    };
</script>

<style>
    .message-participants__icon {
        display: block;
        width: 26px;
        height: 22px;
    }
</style>