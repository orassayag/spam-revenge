const { ApplicationData } = require('../../core/models');

class ApplicationService {

    constructor() {
        this.applicationData = null;
    }

    initiate(data) {
        this.applicationData = new ApplicationData(data);
    }
}

module.exports = new ApplicationService();