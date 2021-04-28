const applicationService = require('./files/application.service');
const confirmationService = require('./files/confirmation.service');
const countLimitService = require('./files/countLimit.service');
const emailAddressService = require('./files/emailAddress.service');
const localService = require('./files/local.service');
const logService = require('./files/log.service');
const pathService = require('./files/path.service');
const proxyService = require('./files/proxy.service');
const puppeteerService = require('./files/puppeteer.service');
const subscribeListService = require('./files/subscribeList.service');
const validationService = require('./files/validation.service');

module.exports = {
    applicationService, confirmationService, countLimitService, emailAddressService,
    logService, localService, pathService, proxyService, puppeteerService,
    subscribeListService, validationService
};