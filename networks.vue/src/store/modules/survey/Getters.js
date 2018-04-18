export default {
    getAllSurveys(state, getters, rootState) {
        return state.surveys.orElse([]);
    },
    getParticipantsSurveysByEmployeeId(state, getters) {
        return getters.getAllSurveys.reduce((participants, survey) => {
            survey.participants.forEach(p => participants.set(p.employeeId, p));
            return participants;
        }, new Map());
    },
    getCompletedSurveys(state, getters) {
        return getters.getAllSurveys.filter(s => s.statusType === 'COMPLETED');
    },
    getActiveSurveys(state, getters) {
        return getters.getAllSurveys.filter(s => s.statusType === 'ACTIVE');
    },
    getAllSurveyTemplates(state, getters, rootState) {
        return state.surveyTemplates.orElse([]);
    },
    getSurveyTemplateRelations(state, getters, rootState){
        let surveyTemplateRelations = {};
        state.surveyTemplates
            .orElse([])
            .forEach(survey => {
                surveyTemplateRelations[survey.id] = survey.relationshipTypeWeights.map(relation => {
                    return {
                        name: relation.relationshipType.name,
                        weight: relation.weight
                    };
                });
            });
        return surveyTemplateRelations;
    },
    routeParams(state, getters, rootState) {
        return rootState.route.params;
    },
    surveyRelationshipTypeWeights(state) {
        return state.survey.orElse({}).relationshipTypeWeights || [];
    },
    getSelectedRelationshipType: (state) => (id) => {
        return state.relationshipTypes
            .orElse([])
            .filter(item => item.id === id)[0];
    },
    surveyQuestions(state) {
        return state.survey.orElse({}).questions || [];
    },
    existsQuestion: (state) => (id) => {
        return state.questions
            .orElse([])
            .some(question => question.id === id);
    },
    existsAddedQuestion: (state) => (id) => {
        const questions = state.survey.orElse({}).questions;
        return !questions ? false : questions.some(question => question.id === id);
    },
    getParticipateEmployeesIds(state, getters) {
        return getters.addedEmployees.map(p => p.employeeId);
    },
    addedEmployees(state) {
        return state.survey.orElse({}).participants || [];
    },
    getEmployeeIds(state) {
        return state.employees.orElse([]).map(employee => employee.id);
    },
    getParticipantByEmployeeId: (state, getters) => (id) => {
        return getters.addedEmployees.filter(p => p.employeeId === id)[0] || {};
    },
    getDepartment: (state) => (id) => {
        return state.departments.orElse([]).filter(d => d.id === id)[0] || {};
    },
    completedSize(state, getters) {
        const questions = getters.surveyQuestions;
        const participants = getters.addedEmployees;
        return participants.filter(p => p.answers.length === questions.length).length;
    },
    notStartedSize(state, getters) {
        const participants = getters.addedEmployees;
        return participants.filter(p => !p.answers.length).length;
    },
    inProgressSize(state, getters) {
        const questions = getters.surveyQuestions;
        const participants = getters.addedEmployees;
        return participants.filter(p => p.answers.length && p.answers.length < questions.length).length;
    },
    completedPercent(state, getters) {
        return getters.addedEmployees.length
            ? parseInt(getters.completedSize / getters.addedEmployees.length * 100)
            : 0;
    },
    getEmployeesWithoutUser: (state, getters) => userId => {
        return state.employees.orElse([]).filter(e => e.id !== userId);
    },
    getManagerSurvey(state) {
        return state.survey.orElse({}).startedByEmployee || {};
    },
    participantAnswers: (state, getters) => id => {
        const participants = state.survey.orElse({}).participants || [];
        const participant = participants.filter(p => p.employeeId === id)[0] || {};
        return participant.answers || [];
    },
    /**
     * Информация о количестве уникальных сотрудников. которые были
     * выбраны в ходе прохождения опроса анкетируемым
     */
    getUniqueParticipantAnswers: (state, getters) => id => {
        let participants = [];
        getters.participantAnswers(id).forEach(a => {
            a.employees.forEach(e => {
                if (participants.every(p => p.id !== e.id)) {
                    participants.push(e);
                }
            });
        });
        return participants;
    },
    /**
     * Информация о количестве уникальных сотрудников, которые были
     * выбраны в ходе прохождения опроса анкетируемым по определённым вопросам
     */
    getUniqueParticipantAnswersByQuestionIds: (state, getters) => (questionIds = [], employeeId) => {
        let participants = [];
        getters.participantAnswers(employeeId)
                .filter(a => questionIds.includes(a.questionId))
                .forEach(a => {
                    a.employees.forEach(e => {
                        if (participants.every(p => p.id !== e.id)) {
                            participants.push(e);
                        }
                    });
                });
        return participants;
    },
    getRatings(state) {
        return state.employeesRatings.orElse({}).ratings || [];
    },
    existsEmployeeInEmployeesRatings: (state, getters) => employeeId => {
        return getters.getRatings.some(r => r.employee.id === employeeId);
    }
};
