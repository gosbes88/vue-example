import { Optional } from '../../../utils/Optional';

export default {
    employeesRatings: Optional.create({}),
    competencies: Optional.create([]),
    departments: Optional.create([]),
    positions: Optional.create([]),
    currentFilter: Optional.create({}),
    filters: Optional.create([]),
    employeeRating: Optional.create({}),
    employeeRelationships: Optional.create([]),
    ratingsHistory: Optional.create({})
};