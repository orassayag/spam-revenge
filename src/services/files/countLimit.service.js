const { CountLimitDataModel } = require('../../core/models');

class CountLimitService {

    constructor() {
        this.countLimitDataModel = null;
    }

    initiate(settings) {
        this.countLimitDataModel = new CountLimitDataModel(settings);
    }
}

module.exports = new CountLimitService();