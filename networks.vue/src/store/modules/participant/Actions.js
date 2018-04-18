import Vue from "vue";

const headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};

export default {
    getSurveysByParticipant({ commit }) {
        Vue.http.get('/networks/service/rest/p/surveys')
                .then(response => commit('fillSurveys', {values: response.body}))
                .catch(e => console.log('Ошибка при загрузке опросов участника'));
    },
    async getAnswer({ commit, getters }, id) {
        try {
            let response = await Vue.http.get(`/networks/service/rest/p/surveys/${getters.routeParams.id}/question/${id}/answers`);
            commit('fillAnswer', {value: response.body});
        } catch (e) {
            throw 'Ошибка при получении данных по вопросу с id=' + id;
        }
    },
    async updateAnswer({ commit, getters }, id) {
        try {
            let formData = new FormData();
            getters.getAnswerEmployeeIds.forEach(e => formData.append('employeeIds', e));
            let response = await Vue.http.post(`/networks/service/rest/p/surveys/${getters.routeParams.id}/question/${id}/answers`, formData, headers);
            commit('fillAnswer', {value: response.body});
        } catch (e) {
            throw 'Ошибка при изменении данных по ответу на вопрос с id=' + id;
        }
    }
}