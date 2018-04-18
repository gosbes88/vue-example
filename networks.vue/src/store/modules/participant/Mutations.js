import {Optional} from "../../../utils/Optional";

export default {
    fillSurveys(state, data) {
        state.surveys = Optional.create(data.values);
    },
    fillAnswer(state, data) {
        state.answer = Optional.create(data.value);
    },
    addEmployeeToAnswer(state, data) {
        let newArray = state.answer.orElse({}).employees
                ? Array.from(state.answer.orElse({}).employees)
                : [];
        newArray.push(data.value);
        state.answer = Optional.create({employees: newArray});
    },
    removeEmployeeFromAnswer(state, data) {
        let newArray = state.answer.orElse({}).employees
                ? state.answer.orElse({}).employees.filter(e => e.id !== data.value)
                : [];
        state.answer = Optional.create({employees: newArray});
    }
}