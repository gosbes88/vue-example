const Employees = () => import('../../components/employees/Employees.vue');
const EmployeeInformation = () => import('../../components/employees/EmployeeInformation.vue');
const SummaryInformation = () => import('../../components/employees/employee/summary/SummaryInformation.vue');
const ComparativeAnalysis = () => import('../../components/employees/employee/ComparativeAnalysis.vue');
const Description = () => import('../../components/employees/employee/Description.vue');
const Dynamics = () => import('../../components/employees/employee/dynamics/Dynamics.vue');
const Indicators = () => import('../../components/employees/employee/indicators/Indicators.vue');
const StructureAndRelations = () => import('../../components/employees/employee/StructureAndRelations.vue');

export default [
    {
        path: 'm/employees',
        name: 'Employees',
        component: Employees
    },
    {
        path: 'm/employee/:id',
        component: EmployeeInformation,
        children: [
            {
                path: "",
                name: "SummaryInformation",
                component: SummaryInformation
            },
            {
                path: "analysis",
                name: "ComparativeAnalysis",
                component: ComparativeAnalysis
            },
            {
                path: "description",
                name: "Description",
                component: Description
            },
            {
                path: "dynamics",
                name: "Dynamics",
                component: Dynamics
            },
            {
                path: "indicators",
                name: "Indicators",
                component: Indicators
            },
            {
                path: "structure",
                name: "StructureAndRelations",
                component: StructureAndRelations
            }
        ]
    }
];