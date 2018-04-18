export default {
    routeParams(state, getters, rootState) {
        return rootState.route.params;
    },
    getIndicators(state, getters) {
        return state.currentFilter.orElse({}).competenciesIds || [];
    },
    getSortColumn(state, getters) {
        return state.currentFilter.orElse({}).sortColumn || 0;
    },
    getSortOrder(state) {
        return state.currentFilter.orElse({}).sortOrder || 'ASC';
    },
    getEmployees(state, getters) {
        return state.employeesRatings.orElse({}).ratings || [];
    },
    getEmployee(state, getters) {
        const listRatings = state.employeeRating.orElse({}).ratings || [];
        return listRatings[0] ? listRatings[0].employee : null;
    },
    getEmployeesTotalCount(state, getters) {
        return state.employeesRatings.orElse({}).totalEmployees;
    },
    getCompetencies(state, getters) {
        return state.employeesRatings.orElse({}).competencies || [];
    },
    getCompetenciesIds(state) {
        return state.competencies.orElse([]).map(c => c.id);
    },
    getEmployeeIndicators(state) {
        const listRatings = state.employeeRating.orElse({}).ratings || [];
        if (!listRatings[0]) {
            return [];
        }
        return listRatings[0].ratings;
    },
    getAvailableRatingsHistory(state) {
        const ratings = state.ratingsHistory.orElse({}).ratings || {};
        const competencies = state.ratingsHistory.orElse({}).competencies || {};
        return Object.keys(ratings).map(key => {
            const availableRatings = ratings[key].filter(r => {
                r.title = r.date.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}:\d{2})[\s\S]*/, "$3-$2-$1 ($4)");
                return r.value !== null;
            });
            return {availableRatings, competence: competencies[key]};
        });
    },
    getFilterById: state => id => {
        return state.filters.orElse([]).filter(f => f.id === id)[0] || {};
    }
};
