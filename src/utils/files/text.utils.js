const validationUtils = require('./validation.utils');

class TextUtils {

    constructor() {
        this.b = '===';
    }

    setLogStatus(status) {
        if (!status) {
            return '';
        }
        return `${this.b}${status}${this.b}`;
    }

    getBackupName(data) {
        const { applicationName, date, title, index } = data;
        return `${applicationName}_${date}-${(index + 1)}${title ? `-${title}` : ''}`;
    }

    addBackslash(text) {
        if (!text) {
            return '';
        }
        return `${text}/`;
    }

    // This method adds leading 0 if needed.
    addLeadingZero(number) {
        if (!validationUtils.isValidNumber(number)) {
            return '';
        }
        return number < 10 ? `0${number}` : number;
    }

    toLowerCaseTrim(text) {
        if (!text) {
            return '';
        }
        return text.toLowerCase().trim();
    }

    removeDuplicates(list) {
        if (!validationUtils.isExists(list)) {
            return list;
        }
        return [...new Set(list)];
    }

    getElements(data) {
        const { list, count, isRandomIfExceeded } = data;
        if (!validationUtils.isExists(list)) {
            return list;
        }
        if (list.length > count) {
            return isRandomIfExceeded ? list.sort(() => .5 - Math.random()).slice(0, count) : list.slice(0, count);
        }
        return list;
    }
}

module.exports = new TextUtils();