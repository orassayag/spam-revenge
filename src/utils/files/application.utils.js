const { EnvironmentEnum } = require('../../core/enums');

class ApplicationUtils {

    constructor() { }

    getApplicationEnvironment(isProductionEnvironment) {
        return isProductionEnvironment ? EnvironmentEnum.PRODUCTION : EnvironmentEnum.DEVELOPMENT;
    }
}

module.exports = new ApplicationUtils();