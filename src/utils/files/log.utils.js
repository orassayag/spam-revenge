const { ColorEnum } = require('../../core/enums');
const colorUtils = require('./color.utils');
const textUtils = require('./text.utils');

class LogUtils {

    constructor() { }

    log(message) {
        console.log(message);
    }

    logColorStatus(data) {
        const { status, color } = data;
        if (!status || !color) {
            return '';
        }
        this.log(colorUtils.createColorMessage({
            message: textUtils.setLogStatus(status),
            color: color
        }));
    }

    logMagentaStatus(text) {
        if (!text) {
            return '';
        }
        return this.logColorStatus({
            status: text,
            color: ColorEnum.MAGENTA
        });
    }
}

module.exports = new LogUtils();