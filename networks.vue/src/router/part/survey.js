const CreateSurvey = () => import('../../components/survey/create/CreateSurvey.vue');
const Survey = () => import('../../components/survey/question/Survey.vue');
const Participants = () => import('../../components/survey/participants/Participants.vue');
const SurveyNew = () => import('../../components/survey/finish/SurveyFinish.vue');
const ParticipantsPage = () => import('../../components/survey/statistics/PartisipantsPage.vue');
const Networks = () => import('../../components/networks/Networks.vue');
const SurveyResults = () => import('../../components/survey/results/SurveyResults.vue');
const TotalAnalytics = () => import('../../components/analytics/TotalAnalytics.vue');

export default [
    {
        path: "m",
        name: "Manager",
        component: Networks
    },
    {
        path: "m/analytics",
        name: "TotalAnalytics",
        component: TotalAnalytics
    },
    {
        path: 'm/create',
        name: 'CreateSurvey',
        component: CreateSurvey
    },
    {
        path: 'm/create/survey',
        component: Survey,
        children: [
            {
                path: '',
                name: 'SurveyOwnSettings',
                component: Survey
            },
            {
                path: ':id',
                name: 'SurveySettings',
                component: Survey
            }
        ]
    },
    {
        path: 'm/create/participants/:id',
        name: 'Participants',
        component: Participants
    },
    {
        path: 'm/create/finish/:id',
        name: 'SurveyNew',
        component: SurveyNew
    },
    {
        path: 'm/survey/:id/results',
        name: 'SurveyResults',
        component: SurveyResults
    },
    {
        path: 'm/:id/participants/page',
        name: 'ParticipantsPage',
        component: ParticipantsPage
    }
];