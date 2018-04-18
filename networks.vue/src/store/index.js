import Vue from 'vue';
import Vuex from 'vuex';
import { Optional } from '../utils/Optional';
import { FORM_HEADERS } from '../utils/Constants';
import SurveyModule from './modules/survey/Survey';
import EmployeesModule from './modules/employees/Employees';
import ParticipantModule from './modules/participant/Participant';
import { BASE_URL } from '../utils/Constants';
import { ERROR_MESSAGE } from '../utils/DeveloperUtils';

Vue.use(Vuex);

const state = {
    user: Optional.empty(),
    userStatistics: Optional.empty(),
    showFooter: false,
    errorPage: false,
    filledFooter: false
};

const getters = {
    getUserName(state, getters){
        const role = getters.getSelectOrganization;

        if (role.lastName || role.firstName) {
            return `${role.lastName || ""} ${role.firstName || ""}`;
        }

        return state.user.orElse({}).login || "";
    },
    getSelectOrganization(state, getters){
        if (!state.user.isPresent()) {
            return {};
        }

        const  organization = Optional.create(state.user.get().selectedOrganization);
        return organization.orElse({});
    },
    hasUser(state, getters) {
        let roles = getters.getSelectOrganization.roles;
        return roles && roles.includes("USER");
    },
    hasManager(state, getters) {
        let roles = getters.getSelectOrganization.roles;
        return roles && ["MANAGER", "CHIEF_MANAGER"].some(r => roles.includes(r));
    },
    getOrganizations(state, getters){
        if (!state.user.isPresent()) {
            return [];
        }

        const  organizations = Optional.create(state.user.get().organizations);
        let result = {};
        organizations.orElse([])
            .forEach(organization => result[organization.organizationId] = organization);

        return result;
    },
    showAnalyticsHint(state, getters) {
        return state.userStatistics.orElse({}).analyticsHintViewed;
    }
};

const mutations = {
    setUser(state, user) {
        state.user = Optional.create(user.value);
    },
    setUserStatistics(state, userStatistics) {
        state.userStatistics = Optional.create(userStatistics.value);
    },
    setFooterView(state, value) {
        state.showFooter = value;
    },
    setErrorPage(state, value) {
        state.errorPage = value;
    },
    changeFilledFooter(state, value) {
        state.filledFooter = value;
    }
};

const actions = {
    async getUserData({ commit, state, getters }) {
        try {
            const response = await Vue.http.get('/as/service/rest/user/current');
            commit('setUser', {value: response.body});
        } catch (e) {
            console.error(e);
        }
    },
    async changeOrganization({ commit, dispatch, state, getters }, id) {
        try {
            let formData = new FormData();
            formData.append('organizationId', id);
            const response = await Vue.http.post('/as/service/rest/user/change-organization', formData, FORM_HEADERS);
            if (response.status === 200) {
                window.location = window.location.origin + BASE_URL;
            }
        } catch (e) {
            console.error(e);
        }
    },
    async getUserStatistics({ commit }) {
        try {
            const response = await Vue.http.get('/networks/service/rest/surveys/user/statistics');
            commit('setUserStatistics', {value: response.body});
        } catch (e) {
            ERROR_MESSAGE(e, 'Ошибка получения статистики юзера(просмотр напоминалки, прохождение демки и т.д.)');
        }
    },
    async removeAnalyticsHint({ commit }) {
        try {
            const response = await Vue.http.post('/networks/service/rest/surveys/update/analytics/hint');
            commit('setUserStatistics', {value: response.body});
        } catch (e) {
            ERROR_MESSAGE(e, 'Ошибка изменения статистики юзера по отображению подсказки бля блока "результаты и анализ"');
        }
    }
};

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        survey: SurveyModule,
        employees: EmployeesModule,
        participant: ParticipantModule
    },
    state,
    getters,
    actions,
    mutations
});