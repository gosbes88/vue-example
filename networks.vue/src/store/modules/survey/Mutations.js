import { Optional } from '../../../utils/Optional';
import { SurveyEquals } from "../../../utils/SurveyEquals";

export default {
    fillSurvey(state, data) {
        state.survey = Optional.create(data.value);
    },
    relationshipTypeWeights(state, relations){
        state.survey = Optional.create({...state.survey.orElse({}), relationshipTypeWeights: relations.value.relationshipTypeWeights || []});
    },
    fillSurveys(state, data) {
        state.surveys = Optional.create(data.values);
    },
    setSurveyName(state, name) {
        state.survey = Optional.create({...state.survey.orElse({}), name});
    },
    setSurveyQuestions(state, questions) {
        state.survey = Optional.create({...state.survey.orElse({}), questions: questions.values});
    },
    fillSurveyTemplates(state, data) {
        state.surveyTemplates = Optional.create(data.values);
    },
    fillRelationshipTypes(state, relations) {
        state.relationshipTypes = Optional.create(relations.values);
    },
    fillQuestions(state, questions) {
        const addedQuestions = state.survey.orElse({}).questions || [];
        let mergeQuestions = function (serverQuestions, addedQuestions){
            if (serverQuestions.length === 0) {
                return [];
            }
            return serverQuestions.filter(question => {
                return addedQuestions.every(e => e.id !== question.id);
            })
        };
        state.questions = Optional.create(mergeQuestions(questions.values, addedQuestions));
    },
    getTempSurvey(state, id) {
        const surveys = JSON.parse(window.sessionStorage.getItem('survey'));
        state.survey = surveys ? Optional.create(surveys[id]) : Optional.create({id: id});
    },
    changeRelationshipTypeWeights(state) {
        state.changeRelationshipTypeWeights = false;
    },
    mergeSurveyData(state, id) {
        const surveys = JSON.parse(window.sessionStorage.getItem('survey'));
        if (surveys) {
            const surveyEquals = new SurveyEquals(state.survey.orElse({}), surveys[id]);
            state.survey = Optional.create(surveyEquals.merge());
            state.changeRelationshipTypeWeights = surveyEquals.recalcRelationshipTypeWeights;
        }
    },
    addSurveyQuestion(state, questionId) {
        const addedQuestion = state.questions
            .orElse([])
            .filter(question => question.id === questionId)[0];
        if (addedQuestion) {
            let questions =  state.survey.get().questions || [];
            questions.push(addedQuestion);
            state.survey = Optional.create({...state.survey.get(), questions});
        }
    },
    updateSurveyQuestion(state, question) {
        let oldQuestions = state.survey.get().questions || [];
        let newQuestion = question.value;
        newQuestion.isAdded = true;
        let questions = oldQuestions.filter(q => q.id !== newQuestion.id);
        questions.push(newQuestion);
        state.survey = Optional.create({...state.survey.get(), questions});
    },
    fillQuestionsByFilter(state, questionId) {
        const addedQuestion = state.questions
            .orElse([])
            .filter(question => question.id === questionId)[0];
        if (addedQuestion) {
            state.questions = Optional.create(state.questions.orElse([]).filter(question => question.id !== questionId));
        }
    },
    removeSurveyQuestion(state, id) {
        const question = state.survey
            .get()
            .questions
            .filter(question => question.id === id)[0];
        if (question) {
            let newQuestions = state.questions.orElse([]);
            newQuestions.push(question);
            state.questions = Optional.create(newQuestions);

            let questions =  state.survey.get().questions;
            questions = questions.filter(question => question.id !== id);
            state.survey = Optional.create({...state.survey.get(), questions});
        }
    },
    duplicateAddedQuestion(state, { oldId, newId }) {
        let questions =  state.survey.get().questions || [];
        const question = questions.filter(question => question.id === oldId)[0];
        if (question) {
            let newQuestion = {...question, id : newId};
            questions.push(newQuestion);
            state.survey = Optional.create({...state.survey.get(), questions});
        }
    },
    addNewQuestion(state, question) {
        question = question.value;
        let newQuestions = state.questions.orElse([]);
        question.isAdded = true;
        newQuestions.push(question);
        state.questions = Optional.create(newQuestions);
    },
    fillEmployees(state, employees) {
        state.employees = Optional.create(employees.values);
    },
    fillDepartments(state, departments) {
        state.departments = Optional.create(departments.values);
    },
    fillPositions(state, positions) {
        state.positions = Optional.create(positions.values);
    },
    fillExistsEmployeeConnections(state, existsEmployeeConnections) {
        state.existsEmployeeConnections = Optional.create(existsEmployeeConnections.values);
    },
    changeField(state, {type, value}) {
        switch (type) {
            case "START_DATE":
                state.survey = Optional.create({...state.survey.get(), startDate: value});
                break;
            case "END_DATE":
                state.survey = Optional.create({...state.survey.get(), endDate: value});
                break;
            case "APPEAL":
                state.survey = Optional.create({...state.survey.get(), appeal: value});
                break;
            default:
                console.log('Field not found');
        }
    },
    setRelationsCount(state, count) {
        state.relationsCount = count.value;
    },
    setEmployeeRelationships(state, employeeRelationships) {
        state.employeeRelationships = Optional.create(employeeRelationships.values);
    },
    setAllEmployeesRelationships(state, employeesRelationships) {
        state.allEmployeesRelationships = Optional.create(employeesRelationships.values);
    },
    fillEmployeesRatings(state, employeesRatings) {
        state.employeesRatings = Optional.create(employeesRatings.value);
    }
};