const Greeting = () => import('../../components/participant/Greeting.vue');
const Answer = () => import('../../components/participant/Answer.vue');
const Result = () => import('../../components/participant/Result.vue');
const StatisticsParticipant = () => import('../../components/participant/StatisticsParticipant.vue');
const DefaultPage = () => import('../../components/participant/DefaultPage');

export default [
    {
        path: "p",
        name: "Participant",
        component: StatisticsParticipant
    },
    {
        path: "p/:id/",
        name: 'ParticipantDefaultPage',
        component: DefaultPage,
    },
    {
        path: "p/:id/greeting",
        name: "Greeting",
        component: Greeting
    },
    {
        path: "p/:id/answer",
        name: "Answer",
        component: Answer
    },
    {
        path: "p/:id/result",
        name: "Result",
        component: Result
    }
];