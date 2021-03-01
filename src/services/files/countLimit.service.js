const { CountLimitData } = require('../../core/models');

class CountLimitService {

    constructor() {
        this.countLimitData = null;
    }

    initiate(settings) {
        this.countLimitData = new CountLimitData(settings);
    }
}

module.exports = new CountLimitService();