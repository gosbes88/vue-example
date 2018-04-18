import Vue from 'vue';
import { vue } from '../../../main';
import { FORM_HEADERS as header, fillFormData } from '../../../utils/Constants';

export default {
    async getDepartments({ commit }) {
        try {
            let response = await Vue.http.get('/organizations/service/rest/organization/departments');
            commit('fillDepartments', {values: response.body});
        } catch (e) {
            throw 'Ошибка при загрузке подразделений';
        }
    },
    async getPositions({ commit }) {
        try {
            let response = await Vue.http.get('/organizations/service/rest/organization/positions');
            commit('fillPositions', {values: response.body});
        } catch (e) {
            throw 'Ошибка при загрузке позиций';
        }
    },
    async getCompetencies({ commit }) {
        try {
            let response = await Vue.http.get('/organizations/service/rest/competencies');
            commit('fillCompetencies', {values: response.body});
        } catch (e) {
            throw 'Ошибка при загрузке компетенций и показателей';
        }
    },
    async getEmployeesRatings({ commit }, params) {
        try {
            let response = await Vue.http.post('/networks/service/rest/m/employees/ratings', fillFormData(params), header);
            commit('fillEmployeesRatings', {values: response.body});
        } catch (e) {
            throw 'Ошибка при загрузке сотрудников подразделений';
        }
    },
    async getFilters({ commit }) {
        try {
            let response = await Vue.http.get('/networks/service/rest/m/employees/filters');
            commit('fillFilters', {values: response.body});
        } catch (e) {
            throw 'Ошибка при загрузке данных по сохранённым фильтрам отображения статистики сотрудников';
        }
    },
    async updateFilter({ commit, state }) {
        try {
            let response = await Vue.http.post('/networks/service/rest/m/employees/filters', state.currentFilter.orElse({}), header);
            commit('updateFilter', {value: response.body});
            commit('fillCurrentFilter', {value: response.body});
        } catch (e) {
            throw 'Ошибка при создании/обновлении фильтра';
        }
    },
    async getEmployeeRating({ commit, getters }) {
        try {
            if (!getters.routeParams.id) {
                return;
            }
            const form = fillFormData({competenciesIds: getters.getCompetenciesIds, employeesIds: getters.routeParams.id});
            let response = await Vue.http.post('/networks/service/rest/m/employees/ratings', form, header);
            commit('fillEmployeeRating', {value: response.body});
        } catch (e) {
            throw 'Ошибка при загрузке информации по участнику';
        }
    },
    async getEmployeeRelationships({ commit }, { employeeId = null, relationshipTypeIds = [] }) {
        try {
            if (!employeeId) {
                return;
            }
            const response = await Vue.http.post(`/networks/service/rest/m/surveys/relationships/${employeeId}`, fillFormData({relationshipTypeIds}), {...header, before(xhr) {
                vue.$xhr = vue.$xhr ? [...vue.$xhr, xhr] : [xhr];
            }});
            commit('fillEmployeeRelationships', {values: response.body});
        } catch (e) {
            throw 'Ошибка получения данных о связях сотрудниками с коллегами';
        }
    },
    async getRatingsHistory({ commit, getters }, competenciesIds) {
        try {
            if (!getters.routeParams.id) {
                return;
            }
            const response = await Vue.http.post(`/networks/service/rest/m/employees/${getters.routeParams.id}/ratings/history`, fillFormData({competenciesIds}), {...header, before(xhr) {
                vue.$xhr = vue.$xhr ? [...vue.$xhr, xhr] : [xhr];
            }});
            commit('fillRatingsHistory', {value: response.body});
        } catch (e) {
            throw 'Ошибка получения данных об истории результатов показателей сотрудника';
        }
    }
};