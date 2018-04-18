export const WAITING_TIME = 500;

export const MAX_SCORE_COMPETENCE = 2500;

export const MAX_SCORE_INDICATOR = 100;

export const EMPLOYEES_LIMIT = 20;

export const MAX_VISIBLE_EMPLOYEES_COUNT = 200;

export const FORM_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};

export const MAX_RADIUS_NODE = 30;

export const MIN_RADIUS_NODE = 10;

export const RELATIONS_MAX_COUNT = 7;

export const CENTRALITY_INDEX_ID = "9055aa15-2e6c-4c7d-91ad-f0e4cc412e91";

export const BASE_URL = "/networks/";

export const LOGIN_URL = "/as/login";

export const HTTP_STATUS = {
    403: 403
    //TODO: по мере прикручивания страниц с ошибками добавлять статусы сюда
};

export const fillFormData = (params) => {
    let formData = new FormData();
    if (typeof params === 'object') {
        for(let prop in params) {
            if (Array.isArray(params[prop])) {
                params[prop].forEach(e => formData.append(prop, e));
            } else if (params[prop] != null) {
                formData.append(prop, params[prop]);
            }
        }
    }
    return formData;
};

export const SORT_BY_NAME = (a, b) => {
    let [textA, textB] = [a.name.trim().toLowerCase(), b.name.trim().toLowerCase()];
    if (textA > textB) {
        return 1;
    } else if (textA < textB) {
        return -1;
    }
    return 0;
};