const logUtils = require('./log.utils');

class SystemUtils {

    constructor() { }

    exit(exitReason, color, code) {
        logUtils.logColorStatus({
            status: `EXIT: ${exitReason}`,
            color: color
        });
        process.exit(code);
    }
}

module.exports = new SystemUtils();