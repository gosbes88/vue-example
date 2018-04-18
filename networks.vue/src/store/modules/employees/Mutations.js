import { Optional } from '../../../utils/Optional';
import { SORT_BY_NAME } from '../../../utils/Constants';

export default {
    clearState(state) {
        for(let key in state) {
            if (state.hasOwnProperty(key)) {
                state[key] = Optional.empty();
            }
        }
    },
    fillDepartments(state, departments) {
        state.departments = Optional.create(departments.values);
    },
    fillPositions(state, positions) {
        state.positions = Optional.create(positions.values);
    },
    fillEmployeesRatings(state, employeesRatings) {
        state.employeesRatings = Optional.create(employeesRatings.values);
    },
    fillRatings(state, ratings) {
        state.employeesRatings = Optional.create({...state.employeesRatings.orElse({}), ratings: ratings.values});
    },
    fillCompetencies(state, competencies) {
        state.competencies = Optional.create(competencies.values);
    },
    updateCurrentFilter(state, param) {
        state.currentFilter = Optional.create({...state.currentFilter.orElse({}), [param.field] : param.value});
    },
    fillCurrentFilter(state, filter) {
        state.currentFilter = Optional.create(filter.value);
    },
    fillFilters(state, filters) {
        state.filters = Optional.create(filters.values);
    },
    updateFilter(state, filter) {
        let arr;
        if (state.filters.orElse([]).some(f => f.id === filter.value.id)) {
            arr = state.filters.orElse([])
                    .map(f => f.id === filter.value.id ? filter.value : f)
                    .sort(SORT_BY_NAME);
        } else {
            arr = state.filters.orElse([]);
            arr.push(filter.value);
            arr.sort(SORT_BY_NAME);
        }
        state.filters = Optional.create(arr);
    },
    fillEmployeeRating(state, employeeRating) {
        state.employeeRating = Optional.create(employeeRating.value);
    },
    fillEmployeeRelationships(state, employeeRelationships) {
        state.employeeRelationships = Optional.create(employeeRelationships.values);
    },
    fillRatingsHistory(state, ratingsHistory) {
        state.ratingsHistory = Optional.create(ratingsHistory.value);
    }
};