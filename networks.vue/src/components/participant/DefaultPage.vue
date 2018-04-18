<template>
    <div></div>
</template>

<script>
    import mixins from '../../mixins/utils';
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        mixins: [ mixins ],
        created() {
            let root = this;
            (async () => {
                if (!root.isUUID(root.$route.params.id)) {
                    root.$router.push("/404");
                    return;
                }
                if (root.isEmptyObject(root.survey.orElse({})) || root.survey.orElse({}).id !== root.$route.params.id) {
                    await root.getSurveyData();
                }
                let id = root.getSelectOrganization.employeeId;
                let participant = root.survey.orElse({}).participants.filter(p => p.employeeId === id)[0];
                if (participant) {
                    root.$router.push(
                        !participant.startedSurvey
                                ? {name: 'Greeting', params: {id: root.$route.params.id}}
                                : participant.answers.length === root.survey.orElse({}).questions.length && root.survey.orElse({}).statusType === 'COMPLETED'
                                        ? {name: 'Result', params: {id: root.$route.params.id}}
                                        : {name: 'Answer', params: {id: root.$route.params.id}}
                    );
                } else {
                    root.$router.push("/404");
                }
            })();
        },
        computed: {
            ...mapState('survey', [
                'survey'
            ]),
            ...mapGetters([
                'getSelectOrganization'
            ])
        },
        methods: {
            ...mapActions('survey', [
                'getSurveyData'
            ])
        }
    };
</script>