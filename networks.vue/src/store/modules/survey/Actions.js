import Vue from 'vue';
import { FORM_HEADERS as headers, fillFormData } from '../../../utils/Constants';
import { ERROR_MESSAGE } from '../../../utils/DeveloperUtils';

//TODO: создать шаблоны resource для уменьшения кода

export default {
    async getSurveys({ commit }) {
        try {
            const response = await Vue.http.get('/networks/service/rest/m/surveys');
            commit('fillSurveys', {values: response.body});
        } catch (e) {
            console.error(e);
        }
    },
    async getSurveyTemplates({ commit }) {
        try {
            const response = await Vue.http.get('/networks/service/rest/m/surveys/templates');
            commit('fillSurveyTemplates', {values: response.body});
        } catch (e) {
            console.error(e);
        }
    },
    async getRelationsCount({ commit }) {
        try {
            const response = await Vue.http.get('/networks/service/rest/m/employees/relationships');
            commit('setRelationsCount', {value: response.body});
        } catch (e) {
            throw 'Ошибка при получении данных о количестве связей между сотрудниками (стартовая страница менеджера)';
        }
    },
    async getSurvey({ state, commit, getters, dispatch }) {
        try {
            commit('changeRelationshipTypeWeights');
            if (getters.routeParams.id) {
                await dispatch('getSurveyData');
            }
            if (!state.survey.orElse(null)) {
                commit('getTempSurvey', getters.routeParams.id);
            } else {
                commit('mergeSurveyData', getters.routeParams.id);
                if (state.changeRelationshipTypeWeights) {
                    await dispatch('recalcRelationshipTypeWeights');
                }
            }
        } catch (e) {
            console.error(e);
        }
    },
    async getSurveyData({ commit, getters }) {
        try {
            const response = await Vue.http.get(`/networks/service/rest/surveys/${getters.routeParams.id}`);
            commit('fillSurvey', {value: response.body});
        } catch (e) {
            console.error(e);
        }
    },
    async recalcRelationshipTypeWeights({commit, dispatch, state}) {
        try {
            let response = await Vue.http.post('/networks/service/rest/m/surveys/refresh', state.survey.orElse({}));
            commit('relationshipTypeWeights', {value: response.body});
            dispatch('setTempSurvey');
        } catch (e) {
            console.error(e);
        }
    },
    async getRelationshipTypes({ commit }) {
        try {
            const response = await Vue.http.get('/networks/service/rest/m/questions/relationships');
            commit('fillRelationshipTypes', {values: response.body});
        } catch (e) {
            console.error(e);
        }
    },
    async getQuestions({ commit }) {
        try {
            const response = await Vue.http.get('/networks/service/rest/m/questions');
            commit('fillQuestions', {values: response.body});
        } catch (e) {
            console.error(e);
        }
    },
    async saveSurvey({ state, commit }, notUseResult = false) {
        try {
            const response = await Vue.http.post('/networks/service/rest/m/surveys', state.survey.orElse({}));
            if (!response.ok) {
                throw new Error('Ошибка при создании нового опроса');
            }
            if (!notUseResult) {
                commit('fillSurvey', {value: response.body});
                window.sessionStorage.removeItem('survey');
            }
        } catch (e) {
            console.error(e);
        }
    },
    setSurveyName({ dispatch, commit }, name) {
        commit('setSurveyName', name);
        dispatch('setTempSurvey');
    },
    async addSurveyQuestion({ dispatch, commit }, questionId) {
        try {
            commit('addSurveyQuestion', questionId);
            commit('fillQuestionsByFilter', questionId);
            dispatch('setTempSurvey');
            await dispatch('recalcRelationshipTypeWeights');
        } catch (e) {
            console.error(e);
        }
    },
    updateSurveyQuestion({ dispatch, commit }, question) {
        commit('updateSurveyQuestion', {value: question});
        dispatch('setTempSurvey');
    },
    async removeSurveyQuestion({ dispatch, commit }, id) {
        try {
            commit('removeSurveyQuestion', id);
            dispatch('setTempSurvey');
            await dispatch('recalcRelationshipTypeWeights');
        } catch (e) {
            console.error(e);
        }
    },
    async duplicateAddedQuestion({ dispatch, commit }, ids) {
        try {
            commit('duplicateAddedQuestion', ids);
            dispatch('setTempSurvey');
            await dispatch('recalcRelationshipTypeWeights');
        } catch (e) {
            console.error(e);
        }
    },
    setTempSurvey({ state }) {
        const survey = state.survey.orElse({});
        if (Object.keys(survey).length > 0) {
            window.sessionStorage.setItem('survey', JSON.stringify({[survey.id]: survey}));
        }
    },
    async getEmployees({ commit }) {
        try {
            const response = await Vue.http.get('/organizations/service/rest/employees');
            commit('fillEmployees', {values: response.body});
        } catch (e) {
            console.log(e);
        }
    },
    async getDepartments({ commit }) {
        try {
            const response = await Vue.http.get('/organizations/service/rest/organization/departments');
            commit('fillDepartments', {values: response.body});
        } catch (e) {
            console.log(e);
        }
    },
    async getPositions({ commit }) {
        try {
            const response = await Vue.http.get('/organizations/service/rest/organization/positions');
            commit('fillPositions', {values: response.body});
        } catch (e) {
            console.log(e);
        }
    },
    async getDepartmentsByEmployees({ commit, getters }) {
        try {
            const response = await Vue.http.post('/organizations/service/rest/organization/departments/by-employees', getters.getParticipateEmployeesIds);
            commit('fillDepartments', {values: response.body});
        } catch (e) {
            console.log(e);
        }
    },
    async getPositionsByEmployees({ commit, getters }) {
        try {
            const response = await Vue.http.post('/organizations/service/rest/organization/positions/by-employees', getters.getParticipateEmployeesIds);
            commit('fillPositions', {values: response.body});
        } catch (e) {
            console.log(e);
        }
    },
    async existsEmployeesConnections({ commit }, employeeIds) {
        try {
            const response = await Vue.http.post('/organizations/service/rest/employees/connections/exists', employeeIds);
            commit('fillExistsEmployeeConnections', {values: response.body});
        } catch (e) {
            console.log(e);
        }
    },
    async changeParticipants({ commit, dispatch, getters }, {isAdded, participantIds}) {
        try {
            let formData = new FormData();
            participantIds.forEach(p => formData.append('participantIds', p));
            const response = isAdded
                    ? await Vue.http.post(`/networks/service/rest/m/surveys/${getters.routeParams.id}/add`, formData, headers)
                    : await Vue.http.post(`/networks/service/rest/m/surveys/${getters.routeParams.id}/remove`, formData, headers);
            if (response.body) {
                commit('fillSurvey', {value: response.body});
                await dispatch('existsEmployeesConnections', getters.getParticipateEmployeesIds);
            }
        } catch (e) {
            console.error(e);
        }
    },
    async addEmployeesByType({ dispatch, getters }, {employeeIds, type}) {
        try {
            let formData = new FormData();
            employeeIds.forEach(id => formData.append('employeeIds', id));
            getters.getParticipateEmployeesIds.forEach(id => formData.append('addedEmployeeIds', id));
            formData.append('type', type);

            const response = await Vue.http.post('/organizations/service/rest/employees/connections/employees', formData, headers);
            await dispatch('changeParticipants', {isAdded: true, participantIds: response.body});
        } catch (e) {
            console.log(e);
        }
    },
    async getEmployeesByFilters({ commit }, obj/*Состав - {filter, position, departmentId, employeeIds = [], offset, limit, includeDismissed = false}*/) {
        try {
            const response = await Vue.http.post('/organizations/service/rest/employees/search', fillFormData(obj), headers);
            commit('fillEmployees', {values: response.body});
        } catch (e) {
            console.log(e);
        }
    },
    async getAllEmployeesCentralityIndex({ commit, getters }, obj/*Состав - {filter, position, departmentId, employeesIds = [], competenciesIds, offset, limit, sortColumn, sortOrder}*/) {
        try {
            const response = await Vue.http.post(`/networks/service/rest/m/surveys/${getters.routeParams.id}/ratings`, fillFormData(obj), headers);
            commit('fillEmployeesRatings', {value: response.body});
        } catch (e) {
            throw 'Ошибка получения индекса центральности по опросу для участников';
        }
    },
    async startSurvey({ commit, getters }) {
        try {
            const response = await Vue.http.post(`/networks/service/rest/m/surveys/${getters.routeParams.id}/start`);
            commit('fillSurvey', {value: response.body});
        } catch (e) {
            throw 'Ошибка старта проекта';
        }
    },
    async stopSurvey({ commit, getters }) {
        try {
            const response = await Vue.http.post(`/networks/service/rest/m/surveys/${getters.routeParams.id}/stop`);
            commit('fillSurvey', {value: response.body});
        } catch (e) {
            throw 'Ошибка остановки проекта';
        }
    },
    async getEmployeeRelationships({ commit, getters }, {employeeId = null, relationshipTypeIds = []}) {
        try {
            const response = await Vue.http.post(`/networks/service/rest/m/surveys/${getters.routeParams.id}/relationships/${employeeId}`, fillFormData({relationshipTypeIds}), headers);
            commit('setEmployeeRelationships', {values: response.body})
        } catch (e) {
            throw 'Ошибка при получении данных по связям участников';
        }
    },
    async getEmployeesRelationships({ commit, getters }, {employeeIds = [], relationshipTypeIds = []}) {
        try {
            const response = await Vue.http.post(`/networks/service/rest/m/surveys/${getters.routeParams.id}/relationships`, fillFormData({relationshipTypeIds, employeeIds}), headers);
            commit('setAllEmployeesRelationships', {values: response.body})
        } catch (e) {
            ERROR_MESSAGE(e, 'Ошибка при получении данных по связям участников в рамках всего проекта');
        }
    },
    async changeSurveyVisitState({ commit }, surveyId) {
        try {
            const response = await Vue.http.post('/networks/service/rest/m/surveys/change/visit/state', fillFormData(surveyId), headers);
            if (!response.body) {
                throw new Error();
            }
            commit('fillSurvey', {value: response.body});
        } catch (e) {
            ERROR_MESSAGE(e, 'Ошибка при изменении статуса посещения менеджером завершённого опроса');
        }
    }
};