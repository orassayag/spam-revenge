const settings = require('../settings/settings');
const { ColorEnum, StatusEnum } = require('../core/enums');
const { applicationService, countLimitService, emailAddressService, localService, logService,
    pathService, proxyService, puppeteerService, subscribeListService, validationService } = require('../services');
const globalUtils = require('../utils/files/global.utils');
const { logUtils, systemUtils } = require('../utils');

class SubscribeLogic {

    constructor() { }

    async run() {
        // Validate all settings are fit to the user needs.
        await this.confirm();
        // Initiate all the settings, configurations, services, etc...
        this.initiate();
        // Validate general settings.
        await this.validateGeneralSettings();
        // Validate subscription process
        await this.validateSubscription();
        // Start the subscription process.
        await this.startSubscription();
    }

    // Let the user confirm all the IMPORTANT settings before the process starts.
    async confirm() { }

    initiate() {
        this.updateStatus('INITIATE THE SERVICES', StatusEnum.INITIATE);
        countLimitService.initiate(settings);
        applicationService.initiate({
            settings: settings,
            status: StatusEnum.INITIATE
        });
        pathService.initiate(settings);
        puppeteerService.initiate();
        logService.initiate(settings);
        emailAddressService.initiate(settings);
        subscribeListService.initiate(settings);
    }

    async validateGeneralSettings() {
        this.updateStatus('VALIDATE GENERAL SETTINGS', StatusEnum.VALIDATE);
        // Validate that the internet connection works.
        await validationService.validateURL({
            url: applicationService.applicationDataModel.validationConnectionLink,
            maximumRetries: countLimitService.countLimitDataModel.maximumValidateInternetConnectionRetriesCount
        });
    }

    async validateSubscription() {
        this.updateStatus('INITIATE LOCAL DATA', StatusEnum.INITIATE_LOCAL_DATA);
        // Validate the public IP address URL.
        await validationService.validateURL({
            url: applicationService.applicationDataModel.publicIPAddressURL,
            maximumRetries: countLimitService.countLimitDataModel.maximumValidateInternetConnectionRetriesCount
        });
        // Set the local data.
        await localService.setLocalData();
        // Set the email addresses to subscribe.
        this.updateStatus('INITIATE EMAIL ADDRESSES', StatusEnum.INITIATE_EMAIL_ADDRESSES);
        emailAddressService.setEmailAddressesList();
        // Set the subscribe list.
        this.updateStatus('INITIATE SUBSCRIBE LIST', StatusEnum.INITIATE_SUBSCRIBE_LIST);
        await subscribeListService.setSubscribeList();
    }

    async startSubscription() {
        // Set up the log console status.
        // Set up the proxy.
        await proxyService.setProxy();
        await this.exit(StatusEnum.FINISH, ColorEnum.GREEN);
    }

    updateStatus(text, status) {
        logUtils.logMagentaStatus(text);
        if (applicationService.applicationDataModel) {
            applicationService.applicationDataModel.status = status;
        }
    }

    async exit(status, color) {
        if (applicationService.applicationDataModel) {
            applicationService.applicationDataModel.status = status;
            if (countLimitService.countLimitDataModel) {
                await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutExitApplication);
            }
            logService.close();
        }
        systemUtils.exit(status, color);
    }
}

module.exports = SubscribeLogic;