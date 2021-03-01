const { PathData } = require('../../core/models');

class PathService {

    constructor() {
        this.pathData = null;
    }

    initiate(settings) {
        this.pathData = new PathData(settings);
    }
}

module.exports = new PathService();