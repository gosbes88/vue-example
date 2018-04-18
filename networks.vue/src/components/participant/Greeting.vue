<template>
    <div class="container-default">
        <div class="breadcrumb">
            <router-link class="breadcrumb-link anim-hover-left" :to="{name: 'Participant'}">
                <i class="breadcrumb-link__icon anim anim-icon arrow-left-gray-icon" :style="{background: 'url(' + ArrowLeftGrayImg + ') no-repeat'}"></i>
                <span v-lang.survey.surveysBack></span>
            </router-link>
        </div>

        <article class="container-small">
            <div class="center-block mb-3">
                <img class="page-content-logo" src="../../assets/img/networks-logo.svg">
            </div>

            <div class="text-center">
                <h1 class="title-big-page" :title="getSurvey.name" v-text="getSurvey.name"></h1>
            </div>

            <div class="page-text">
                <p class="page-content-subtitle" v-lang.survey.greetingWelcome></p>

                <p class="text-center" v-lang.survey.greetingText></p>
            </div>

            <div class="manager-message-container" v-if="existsAppeal">
                <img class="manager-message__img center-block" :src="getAvatar">
                <div class="manager-message" v-text="getSurvey.appeal"></div>
            </div>

            <div class="hello-line center-block mt-5 mb-4">
                <div class="hello-line__bg-left"></div>
                <div class="hello-line__br"></div>
                <div class="hello-line__bg-right"></div>
            </div>
        </article>

        <div class="btn-next-link-wrap">
            <a class="btn-next-link next-link" href="javascript: void(0);" @click="startSurvey">
                <i class="next-link__icon anim" :style="{background: 'url(' + NextImg + ') no-repeat'}"></i>
                <span class="next-link__text" v-lang.survey.surveyStart></span>
            </a>
        </div>
    </div>
</template>

<script>
    import AvatarImg from '../../assets/img/avatar-default-big.png';
    import NextImg from '../../assets/img/next.png';
    import ArrowLeftGrayImg from '../../assets/img/arrow-left-dark-gray.svg';
    import mixins from '../../mixins/utils';
    import { mapActions, mapState, mapGetters } from 'vuex';

    export default {
        data() {
            return {
                AvatarImg,
                NextImg,
                ArrowLeftGrayImg
            };
        },
        head: {
            title() {
                return {
                    inner: this.translate('survey.greeting')
                };
            }
        },
        mixins: [ mixins ],
        created() {
            if (this.isEmptyObject(this.getSurvey) || this.getSurvey.id !== this.$route.params.id) {
                this.getSurveyData();
            }
        },
        computed: {
            existsAppeal() {
                return this.getSurvey.appeal && this.getSurvey.appeal.trim().length > 0;
            },
            getAvatar() {
                return this.getManagerSurvey.avatar
                    ? `/organizations/img/employee/${this.getManagerSurvey.id}/avatar`
                    : `${this.AvatarImg}`;
            },
            getSurvey() {
                return this.survey.orElse({});
            },
            ...mapState('survey', [
                'survey'
            ]),
            ...mapGetters('survey', [
                'getManagerSurvey'
            ])
        },
        methods: {
            startSurvey() {
                this.$http.post(`/networks/service/rest/p/surveys/${this.$route.params.id}/start`)
                        .then(response => {
                            if (response.ok) {
                                this.$router.push({name: 'Answer', params: {id: this.$route.params.id}});
                            }
                        })
                        .catch(e => console.log('Ошибка при старте опросов участника \n', e));
            },
            ...mapActions('participant', [
                'getSurveyData'
            ])
        }
    };
</script>