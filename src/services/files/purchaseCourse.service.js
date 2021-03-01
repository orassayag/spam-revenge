const puppeteerService = require('./puppeteer.service');

class PurchaseCourseService {

    constructor() { }

    async purchaseCourses() {
        // Purchase courses.
        return await puppeteerService.purchaseCourses();
    }
}

module.exports = new PurchaseCourseService();