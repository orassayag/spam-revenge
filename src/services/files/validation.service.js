const isReachable = require('is-reachable');
const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const globalUtils = require('../../utils/files/global.utils');

class ValidationService {

    constructor() { }

    async validateURLs() {
        const urls = [applicationService.applicationData.coursesBaseURL, applicationService.applicationData.udemyBaseURL];
        for (let i = 0; i < urls.length; i++) {
            await this.validateURL(urls[i]);
        }
    }

    async validateURL(url) {
        let isConnected = true;
        for (let i = 0; i < countLimitService.countLimitData.maximumURLValidationCount; i++) {
            try {
                isConnected = await isReachable(url);
            } catch (error) {
                isConnected = false;
            }
            if (isConnected) {
                break;
            }
            else {
                await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutURLValidation);
            }
        }
        if (!isConnected) {
            throw new Error(`${url} is not available (1000024)`);
        }
    }
}

module.exports = new ValidationService();