import employees from './part/employees';
import survey from './part/survey';
import participant from './part/participant';

const Empty = () => import('../components/common/Empty.vue');
const RouterWrap = () => import('../components/common/RouterWrap.vue');
const NotFound = () => import('../components/common/NotFound.vue');
const Forbidden = () => import('../components/common/Forbidden.vue');
const InternalServerError = () => import('../components/common/InternalServerError.vue');

export default [
    {
        path: '/',
        component: RouterWrap,
        children: [
            {
                path: "",
                name: "Networks",
                component: Empty
            },
            ...employees,
            ...survey,
            ...participant
        ]
    },
    {
        path: "/403",
        name: "Forbidden",
        component: Forbidden
    },
    {
        path: '*',
        component: NotFound
    }
];
