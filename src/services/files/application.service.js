const { ApplicationDataModel } = require('../../core/models');

class ApplicationService {

    constructor() {
        this.applicationDataModel = null;
    }

    initiate(data) {
        this.applicationDataModel = new ApplicationDataModel(data);
    }
}

module.exports = new ApplicationService();