const colorUtils = require('./color.utils');
const regexUtils = require('./regex.utils');
const validationUtils = require('./validation.utils');

class TextUtils {

    constructor() {
        this.b = '===';
    }

    cutText(data) {
        const { text, count } = data;
        if (!text) {
            return '';
        }
        if (text.length > count) {
            return text.substring(0, count);
        }
        return text;
    }

    setLogStatus(status) {
        if (!status) {
            return '';
        }
        return `${this.b}${status}${this.b}`;
    }

    setLogStatusColored(status, color) {
        if (!status || !color) {
            return '';
        }
        const delimiter = colorUtils.createColorMessage({
            message: this.b,
            color: color
        });
        return `${delimiter}${status}${delimiter}`;
    }

    getBackupName(data) {
        const { applicationName, date, title, index } = data;
        return `${applicationName}_${date}-${(index + 1)}${title ? `-${title}` : ''}`;
    }

    // This method add leading 0 if needed.
    addLeadingZero(number) {
        if (!validationUtils.isValidNumber(number)) {
            return '';
        }
        return number < 10 ? `0${number}` : number;
    }

    // This method convert a given number to display comma number.
    getNumberWithCommas(number) {
        if (number <= -1 || !validationUtils.isValidNumber(number)) {
            return '';
        }
        return number.toString().replace(regexUtils.numberCommasRegex, ',');
    }

    addBackslash(text) {
        if (!text) {
            return '';
        }
        return `${text}/`;
    }

    getSplitNumber(text) {
        if (!text) {
            return -1;
        }
        return Number(text.split('_')[0]);
    }

    toLowerCase(text) {
        if (!text) {
            return '';
        }
        return text.toLowerCase();
    }

    toLowerCaseTrim(text) {
        if (!text) {
            return '';
        }
        return text.toLowerCase().trim();
    }

    removeAllNoneNumbers(text) {
        if (!text) {
            return '';
        }
        return text.replace(regexUtils.numbersDotOnlyRegex, '');
    }

    addBreakLine(text) {
        return `${text}\r\n`;
    }

    removeLastCharacters(data) {
        const { value, charactersCount } = data;
        if (!value || !validationUtils.isValidNumber(charactersCount)) {
            return '';
        }
        return value.substring(0, value.length - charactersCount);
    }

    getPositiveNumber(number) {
        if (!validationUtils.isValidNumber(number)) {
            return -1;
        }
        return Math.abs(number);
    }

    getFloorPositiveNumber(number) {
        return this.addLeadingZero(this.getFloorNumber(number));
    }

    getFloorNumber(number) {
        if (!validationUtils.isValidNumber(number)) {
            return -1;
        }
        return Math.floor(number);
    }

    getNumberOfNumber(data) {
        const { number1, number2 } = data;
        if (!validationUtils.isValidNumber(number1) || !validationUtils.isValidNumber(number2)) {
            return '';
        }
        return `${this.getNumberWithCommas(number1)}/${this.getNumberWithCommas(number2)}`;
    }

    calculatePercentageDisplay(data) {
        const { partialValue, totalValue } = data;
        if (!validationUtils.isValidNumber(partialValue) || !validationUtils.isValidNumber(totalValue)) {
            return '';
        }
        return `${this.addLeadingZero(((100 * partialValue) / totalValue).toFixed(2))}%`;
    }

    getNumber2CharactersAfterDot(number) {
        if (!validationUtils.isValidNumber(number)) {
            return '';
        }
        return this.getNumberWithCommas(parseFloat(Math.round(number * 100) / 100).toFixed(2));
    }

    getAsteriskCharactersString(charactersCount) {
        if (!validationUtils.isValidNumber(charactersCount)) {
            return '';
        }
        return Array(charactersCount).join('*');
    }

    getEmailLocalPart(email) {
        if (!email || email.indexOf('@') === -1) {
            return '';
        }
        return email.split('@')[0];
    }

    getCapitalEachWordFromURL(url) {
        return url.split('-').map(word => {
            return word ? word[0].toUpperCase() + word.substring(1) : '';
        }).join(' ');
    }

    getVariableType(obj) {
        return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
    }

    replaceCharacter(text, origin, target) {
        if (!text) {
            return '';
        }
        return text.replace(regexUtils.createRegex(origin, 'g'), target);
    }
}

module.exports = new TextUtils();