import AvatarImg from '../assets/img/avatar-default.png';
import { Optional } from '../utils/Optional';

export default {
    methods: {
        getAvatar(employee) {
            return employee.avatar
                ? `/organizations/img/employee/${employee.id}/avatar`
                : `${AvatarImg}`;
        },
        getParticipantInfo(employee) {
            return `${employee.lastName || ''} ${employee.name || ''} ${employee.dismissed ? this.translate('participants.dismissed') : ''}`;
        },
        getPositionWithDepartment(employee) {
            const existsFullData = employee.department && employee.position || employee.departmentName && employee.positionName;
            return `${employee.position || employee.positionName || ''}${existsFullData ? ', ' : ''}${employee.department || employee.departmentName || ''}`;
        },
        sortFunction(type = 'name') {
            return sortByType[type];
        }
    }
}

const GET_VALUE = val => Optional.create(val).orElse("");

const sortByType = {
    'name': (e1, e2) => {
        let [lastNameA, lastNameB] = [GET_VALUE(e1.lastName).trim().toLowerCase(), GET_VALUE(e2.lastName).trim().toLowerCase()];
        let [nameA, nameB] = [GET_VALUE(e1.name).trim().toLowerCase(), GET_VALUE(e2.name).trim().toLowerCase()];
        if (lastNameA > lastNameB) {
            return 1;
        } else if (lastNameA < lastNameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        } else if (nameA < nameB) {
            return -1;
        }
        return 0;
    },
    'department': (e1, e2) => e1.department || e1.departmentName > e2.department || e2.departmentName,
    'indexLow': (e1, e2) => e1.index > e2.index,
    'indexHigh': (e1, e2) => e1.index < e2.index
};