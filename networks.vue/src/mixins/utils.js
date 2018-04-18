export default {
    methods: {
        declOfNum(number, titles) {
            let cases = [2, 0, 1, 1, 1, 2];
            return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
        },
        findFirst(arr, defaultValue = null) {
            if (!Array.isArray(arr)) {
                throw 'Ошибка извлечения первого элемента массива. Переданный параметр не является массивом.';
            }
            return arr[0] || defaultValue;
        },
        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        isUUID(value) {
            return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(value);
        },
        isEmptyObject(filters) {
            if (!filters || typeof filters !== "object" || Object.keys(filters).length === 0) {
                return true;
            }
            for (let key in filters) {
                if (Array.isArray(filters[key]) && !filters[key].length) {
                    continue;
                }
                if (filters[key]) {
                    return false;
                }
            }
            return true;
        },
        sortObjectByKeys(object) {
            const keys = Object.keys(object).sort();
            let temp = {};
            keys.forEach(key => temp[key] = object[key]);
            object = temp;
        }
    },
    filters: {
        communicationFilter(item, index, maxCount) {
            let punctuation = index === maxCount ? '. ' : ', ';
            return `${item.name}: ${item.weight}%${punctuation}`;
        },
        getStartAngle(percent) {
            let onePercent = Math.PI / 50;
            return Math.PI / 2 - parseFloat(onePercent * percent / 2);
        }
    }
}