export const Strings = {
    EMPTY: "",
    BLANK: " ",
    isEmpty(val="") {
        if (typeof val !== 'string') {
            throw 'Element - ' + '"' + val + '" is not text';
        }
        return val.length === 0;
    },
    isNotEmpty(val = "") {
        return !this.isEmpty(val);
    },
    isBlank(val = "") {
        return !this.isNotBlank(val);
    },
    isNotBlank(val = "") {
        return this.isNotEmpty(val) && val.trim().length > 0;
    },
    includesIgnoreCase(val1, val2) {
        if (typeof val1 !== 'string') {
            throw 'Element - ' + '"' + val1 + '" is not text';
        }
        if (typeof val2 !== 'string') {
            throw 'Element - ' + '"' + val2 + '" is not text';
        }
        return val1.toLowerCase().includes(val2.toLowerCase());
    },
    equals(val1, val2) {
        if (typeof val1 !== 'string') {
            throw 'Element - ' + '"' + val1 + '" is not text';
        }
        if (typeof val2 !== 'string') {
            throw 'Element - ' + '"' + val2 + '" is not text';
        }
        return val1 === val2;
    },
    equalsIgnoreCase(val1, val2) {
        if (typeof val1 !== 'string') {
            throw 'Element - ' + '"' + val1 + '" is not text';
        }
        if (typeof val2 !== 'string') {
            throw 'Element - ' + '"' + val2 + '" is not text';
        }
        return val1.toLowerCase() === val2.toLowerCase();
    },
    orDefault(val, defaultVal) {
        return typeof val !== 'string' ? defaultVal || "" : val;
    }
};