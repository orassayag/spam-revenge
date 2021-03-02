const applicationService = require('./files/application.service');
const confirmationService = require('./files/confirmation.service');
const countLimitService = require('./files/countLimit.service');
const fileService = require('./files/file.service');
const logService = require('./files/log.service');
const pathService = require('./files/path.service');
const puppeteerService = require('./files/puppeteer.service');
const subscribeListService = require('./files/subscribeList.service');
const validationService = require('./files/validation.service');

module.exports = {
    applicationService, confirmationService, countLimitService, fileService, logService,
    pathService, puppeteerService, subscribeListService, validationService
};

/* const accountService = require('./files/account.service');
const applicationService = require('./files/application.service');
const confirmationService = require('./files/confirmation.service');
const countLimitService = require('./files/countLimit.service');
const courseService = require('./files/course.service');
const createCourseService = require('./files/createCourse.service');
const domService = require('./files/dom.service');
const fileService = require('./files/file.service');
const logService = require('./files/log.service');
const pathService = require('./files/path.service');
const puppeteerService = require('./files/puppeteer.service');
const purchaseCourseService = require('./files/purchaseCourse.service');
const updateCourseService = require('./files/updateCourse.service');
const validationService = require('./files/validation.service');

module.exports = {
    accountService, applicationService, confirmationService, countLimitService, createCourseService,
    courseService, domService, fileService, logService, pathService, puppeteerService, purchaseCourseService,
    updateCourseService, validationService
}; */