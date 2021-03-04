const settings = require('../settings/settings');
const { Color, Status } = require('../core/enums');
const { applicationService, countLimitService, emailAddressService, localService, logService,
    pathService, puppeteerService, subscribeListService, validationService } = require('../services');
const { logUtils, systemUtils } = require('../utils');
const globalUtils = require('../utils/files/global.utils');

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

    // Let the user confirm all the IMPORTANT settings before the process start.
    async confirm() {
        /*         if (!await confirmationService.confirm(settings)) {
                    this.exit(Status.ABORT_BY_THE_USER, Color.RED);
                } */
    }

    initiate() {
        logUtils.logMagentaStatus('INITIATE THE SERVICES');
        countLimitService.initiate(settings);
        applicationService.initiate({
            settings: settings,
            status: Status.INITIATE
        });
        pathService.initiate(settings);
        puppeteerService.initiate();
        logService.initiate(settings);
        emailAddressService.initiate(settings);
    }

    async validateGeneralSettings() {
        logUtils.logMagentaStatus('VALIDATE GENERAL SETTINGS');
        // Validate that the internet connection works.
        await validationService.validateURL(applicationService.applicationData.validationConnectionLink);
    }

    async validateSubscription() {
        // Validate the public IP address URL.
        await validationService.validateURL(applicationService.applicationData.publicIPAddressURL);
        // Set the local data.
        await localService.setLocalData();
        // Set the email addresses to subscribe.
        emailAddressService.setEmailAddressesList();
        // Set the subscribe list.
        await subscribeListService.setSubscribeList();
    }

    async startSubscription() {
        await this.exit(Status.FINISH, Color.GREEN);
    }

    async exit(status, color) {
        if (applicationService.applicationData) {
            applicationService.applicationData.status = status;
            if (countLimitService.countLimitData) {
                await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutExitApplication);
            }
            logService.close();
        }
        systemUtils.exit(status, color);
    }
}

module.exports = SubscribeLogic;
/*         console.log(localService.localData); */
        // Initiate the account service first.
        //await accountService.initiate(settings);
                //await this.startSession(urls);

/* const settings = require('../settings/settings');
const { Color, Method, Mode, Status } = require('../core/enums');
const { logUtils, systemUtils, validationUtils } = require('../utils');
const globalUtils = require('../utils/files/global.utils');

class PurchaseLogic {

    constructor() { }

    async run(urls) {
        // Initiate the account service first.
        await accountService.initiate(settings);
        // Validate all settings are fit to the user needs.
        await this.confirm();
        // Initiate all the settings, configurations, services, etc...
        await this.initiate();
        // Validate general settings.
        await this.validateGeneralSettings();
        // Start the sending emails processes.
        await this.startSession(urls);
    }

    validateCoursesDatesValue(coursesDatesValue) {
        const coursesDatesResult = courseService.validateCoursesDatesValue(coursesDatesValue);
        if (coursesDatesResult.coursesError) {
            throw new Error(coursesDatesResult.coursesError);
        }
        return coursesDatesResult;
    }

    async validateGeneralSettings() {
        logUtils.logMagentaStatus('VALIDATE GENERAL SETTINGS');
        // Validate methods.
        if (!applicationService.applicationData.isCreateCoursesMethodActive) {
            this.exit(Status.INVALID_METHOD, Color.RED);
        }
        // Validate internet connection works.
        await validationService.validateURLs();
    }

    async startSession(urls) {
        // Initiate.
        if (applicationService.applicationData.mode === Mode.SESSION) {
            if (!validationUtils.isExists(urls)) {
                await this.exit(Status.FINISH, Color.GREEN);
            }
            createCourseService.createSessionCourses(urls);
            const purchaseCoursesResult = await purchaseCourseService.purchaseCourses();
            if (purchaseCoursesResult) {
                await this.exit(purchaseCoursesResult, Color.RED);
            }
            await this.exit(Status.FINISH, Color.GREEN);
        }
        else {
            applicationService.applicationData.startDateTime = new Date();
            logService.startLogProgress();
            if (applicationService.applicationData.isCreateCoursesMethodActive) {
                this.setApplicationMethod(Method.CREATE_COURSES);
                const createCoursesResult = await createCourseService.createCourses();
                if (createCoursesResult) {
                    await this.exit(createCoursesResult, Color.RED);
                }
            }
            if (applicationService.applicationData.isUpdateCoursesMethodActive) {
                this.setApplicationMethod(Method.UPDATE_COURSES);
                const updateCoursesResult = await updateCourseService.updateCourses();
                if (updateCoursesResult) {
                    await this.exit(updateCoursesResult, Color.RED);
                }
            }
            if (applicationService.applicationData.isPurchaseCoursesMethodActive) {
                this.setApplicationMethod(Method.PURCHASE_COURSES);
                const purchaseCoursesResult = await purchaseCourseService.purchaseCourses();
                if (purchaseCoursesResult) {
                    await this.exit(purchaseCoursesResult, Color.RED);
                }
            }
        }
        await this.exit(Status.FINISH, Color.GREEN);
    }

    setApplicationMethod(method) {
        applicationService.applicationData.method = method;
        courseService.coursesData.courseIndex = 0;
    }

    async exit(status, color) {
        if (applicationService.applicationData) {
            applicationService.applicationData.status = status;
            if (countLimitService.countLimitData) {
                await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutExitApplication);
            }
            logService.close();
        }
        systemUtils.exit(status, color);
    }
}

module.exports = PurchaseLogic; */