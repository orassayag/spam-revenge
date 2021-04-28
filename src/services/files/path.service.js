const { PathDataModel } = require('../../core/models');

class PathService {

    constructor() {
        this.pathDataModel = null;
    }

    initiate(settings) {
        this.pathDataModel = new PathDataModel(settings);
    }
}

module.exports = new PathService();