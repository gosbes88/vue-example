export default {
    surveysByType: (state) => (type) => {
        return state.surveys.orElse([]).filter(s => s.statusType === type);
    },
    allParticipants(state, getters) {
        let participants = [];
        state.surveys.orElse([]).forEach(s => {
            s.participants.forEach(p => {
                if (!participants.includes(p.employeeId)) {
                    participants.push(p.employeeId);
                }
            });
        });
        return participants;
    },
    routeParams(state, getters, rootState) {
        return rootState.route.params;
    },
    getSelectedEmployees(state, getters) {
        return state.answer.orElse({}).employees || [];
    },
    containsEmployee: (state, getters) => id => {
        return getters.getSelectedEmployees.some(e => e.id === id);
    },
    getAnswerEmployeeIds(state, getters) {
        return getters.getSelectedEmployees.map(e => e.id);
    }
};