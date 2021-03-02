const textUtils = require('./text.utils');
const validationUtils = require('./validation.utils');

class TimeUtils {

    constructor() {}

    getDateNoSpaces() {
        const date = new Date();
        return [this.getDay(date), this.getMonth(date), this.getYear(date)].join('');
    }

    getFullDateNoSpaces() {
        const date = new Date();
        return `${[this.getYear(date), this.getMonth(date), this.getDay(date)].join('')}_${[this.getHours(date), this.getMinutes(date), this.getSeconds(date)].join('')}`;
    }

    getSeconds(date) {
        return textUtils.addLeadingZero(date.getSeconds());
    }

    getMinutes(date) {
        return textUtils.addLeadingZero(date.getMinutes());
    }

    getHours(date) {
        return textUtils.addLeadingZero(date.getHours());
    }

    getDay(date) {
        return textUtils.addLeadingZero(date.getDate());
    }

    getMonth(date) {
        return textUtils.addLeadingZero(date.getMonth() + 1);
    }

    getYear(date) {
        return date.getFullYear();
    }

/*     constructor() {
        this.shortMonths = {
            'jan': '1', 'feb': '2', 'mar': '3', 'apr': '4', 'may': '5', 'jun': '6',
            'jul': '7', 'aug': '8', 'sep': '9', 'oct': '10', 'nov': '11', 'dec': '12'
        };
    }

    getFullTime() {
        const date = new Date();
        return `${this.getHours(date)}:${this.getMinutes(date)}:${this.getSeconds(date)}`;
    }

    getDateNoSpacesFromString(date) {
        return date.split('/').join('');
    }

    getCommasDate(date) {
        if (!date) {
            date = new Date();
        }
        return `${[this.getYear(date), this.getMonth(date), this.getDay(date)].join('/')}`;
    }

    // Format yyyy-mm-dd. Example: 8 Dec , 2020.
    getDateFromString(date) {
        if (!date) {
            return date;
        }
        const split = date.split(' ');
        return `${split[3]}/${textUtils.addLeadingZero(this.shortMonths[textUtils.toLowerCase(split[1])])}/${textUtils.addLeadingZero(split[0])}`;
    }

    getFullDateTemplate(date) {
        if (!date) {
            date = new Date();
        }
        return `${[this.getDay(date), this.getMonth(date), this.getYear(date)].join('/')} ${[this.getHours(date), this.getMinutes(date), this.getSeconds(date)].join(':')}`;
    }

    getDifferenceTimeBetweenDates(data) {
        const { startDateTime, endDateTime } = data;
        if (!validationUtils.isValidDate(startDateTime) || !validationUtils.isValidDate(endDateTime)) {
            return null;
        }
        // Get the total time.
        const totalTime = textUtils.getPositiveNumber(endDateTime - startDateTime);
        // Get total seconds between the times.
        let delta = totalTime / 1000;
        // Calculate (and subtract) whole days.
        const days = textUtils.getFloorPositiveNumber(delta / 86400);
        delta -= days * 86400;
        // Calculate (and subtract) whole hours.
        const hours = textUtils.getFloorPositiveNumber((delta / 3600) % 24);
        delta -= hours * 3600;
        // Calculate (and subtract) whole minutes.
        const minutes = textUtils.getFloorPositiveNumber((delta / 60) % 60);
        delta -= minutes * 60;
        // What's left is seconds.
        // In theory the modulus is not required.
        const seconds = textUtils.getFloorPositiveNumber(delta % 60);
        return `${days}.${hours}:${minutes}:${seconds}`;
    }

    getDateObjFromString(date) {
        const parts = date.split('/');
        try {
            // Format: yyyy/mm/dd.
            date = new Date(parts[0], parts[1] - 1, parts[2]);
        }
        catch {
            date = null;
        }
        return date;
    }

    getAllDatesBetweenDates(data) {
        let { startDateTime, endDateTime } = data;
        if (!startDateTime || !endDateTime) {
            return null;
        }
        startDateTime = this.getDateObjFromString(startDateTime);
        endDateTime = this.getDateObjFromString(endDateTime);
        if (!startDateTime || !endDateTime) {
            return null;
        }
        if (startDateTime > endDateTime) {
            return null;
        }
        const list = [];
        for (const dt = new Date(startDateTime); dt <= endDateTime; dt.setDate(dt.getDate() + 1)) {
            list.push(this.getCommasDate(new Date(dt)));
        }
        return list;
    } */
}

module.exports = new TimeUtils();