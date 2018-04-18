import { Optional } from '../../../utils/Optional';

export default {
    surveys: Optional.create([]),
    surveyTemplates: Optional.create([]),
    survey: Optional.empty(),
    relationshipTypes: Optional.create([]),
    questions: Optional.create([]),
    changeRelationshipTypeWeights: false,
    employees: Optional.create([]),
    departments: Optional.create([]),
    positions: Optional.create([]),
    existsEmployeeConnections: Optional.create({}),
    relationsCount: 0,
    employeeRelationships: Optional.create([]),
    allEmployeesRelationships: Optional.create([]),
    employeesRatings: Optional.create({})
};