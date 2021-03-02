const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

class PuppeteerService {

    constructor() {
        this.pageOptions = null;
        this.waitForFunction = null;
    }

    initiate() {
        puppeteerExtra.use(pluginStealth());
        this.pageOptions = {
            waitUntil: 'networkidle2',
            timeout: this.timeout
        };
        this.waitForFunction = 'document.querySelector("body")';
    }
}

module.exports = new PuppeteerService();

/* const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const { Color, CourseStatus, Mode, Status } = require('../../core/enums');
const accountService = require('./account.service');
const applicationService = require('./application.service');
const courseService = require('./course.service');
const countLimitService = require('./countLimit.service');
const domService = require('./dom.service');
const { courseUtils, crawlUtils, logUtils, systemUtils, validationUtils } = require('../../utils');
const globalUtils = require('../../utils/files/global.utils');

class PuppeteerService {

    constructor() {
        this.purchaseErrorInARowCount = 0;
        this.timeout = null;
        this.pageOptions = null;
        this.waitForFunction = null;
        this.isPlannedClose = null;
    }

    initiate() {
        puppeteerExtra.use(pluginStealth());
        this.timeout = countLimitService.countLimitData.millisecondsTimeoutSourceRequestCount;
        this.pageOptions = {
            waitUntil: 'networkidle2',
            timeout: this.timeout
        };
        this.waitForFunction = 'document.querySelector("body")';
    }

    async initiateCrawl(isDisableAsserts) {
        // Set the browser.
        this.isPlannedClose = false;
        const browser = await puppeteerExtra.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--start-maximized',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        });
        const pid = browser.process().pid;
        browser.on('disconnected', () => {
            systemUtils.killProcess(pid);
            if (!this.isPlannedClose) {
                systemUtils.exit(Status.BROWSER_CLOSE, Color.RED, 0);
            }
        });
        process.on('SIGINT', () => {
            this.close(browser, true);
        });
        // Set the page and close the first empty tab.
        const page = await browser.newPage();
        const pages = await browser.pages();
        if (pages.length > 1) {
            await pages[0].close();
        }
        await page.setRequestInterception(true);
        await page.setJavaScriptEnabled(false);
        await page.setDefaultNavigationTimeout(this.timeout);
        page.on('request', (request) => {
            if (isDisableAsserts && ['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue();
            }
        });
        return {
            browser: browser,
            page: page
        };
    }

    async createCourses() {
        let isErrorInARow = false;
        // Check if to scan specific page or all pages.
        const isSpecificPage = applicationService.applicationData.specificCoursesPageNumber &&
            validationUtils.isPositiveNumber(applicationService.applicationData.specificCoursesPageNumber) &&
            applicationService.applicationData.specificCoursesPageNumber < countLimitService.countLimitData.maximumPagesNumber;
        const { browser, page } = await this.initiateCrawl(true);
        try {
            // Go to the courses from single URLs.
            for (let i = 0; i < applicationService.applicationData.coursesDatesValue.length; i++) {
                const coursesCurrentDate = applicationService.applicationData.coursesDatesValue[i];
                for (let y = 0; y < countLimitService.countLimitData.maximumPagesNumber; y++) {
                    applicationService.applicationData.status = Status.CREATE_COURSES;
                    applicationService.applicationData.coursesCurrentDate = coursesCurrentDate;
                    const pageNumber = isSpecificPage ? applicationService.applicationData.specificCoursesPageNumber : y + 1;
                    const url = `${applicationService.applicationData.coursesBaseURL}/${coursesCurrentDate}/page/${pageNumber}/`;
                    await page.goto(url, this.pageOptions);
                    await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
                    const mainContent = await page.content();
                    // Create all the courses from the main page with pagination.
                    const coursesResult = await domService.createSingleCourses({
                        mainContent: mainContent,
                        pageNumber: pageNumber,
                        indexPageNumber: y,
                        indexDate: i
                    });
                    if (coursesResult.isErrorInARow) {
                        isErrorInARow = true;
                        break;
                    }
                    if (!coursesResult.coursesCount) {
                        break;
                    }
                    courseService.coursesData.totalPagesCount += 1;
                    courseService.coursesData.totalCreateCoursesCount += coursesResult.coursesCount;
                    await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutBetweenCoursesMainPages);
                    applicationService.applicationData.status = Status.PAUSE;
                    if (isSpecificPage) {
                        break;
                    }
                }
            }
        }
        catch (error) {
            logUtils.log(error);
        }
        await this.close(browser, true);
        return isErrorInARow;
    }

    async updateCoursesData() {
        let isErrorInARow = false;
        const { browser, page } = await this.initiateCrawl(true);
        try {
            // Loop on the course URL to get the course full data.
            const originalCoursesCount = courseService.coursesData.coursesList.length;
            for (let i = 0; i < originalCoursesCount; i++) {
                applicationService.applicationData.status = Status.UPDATE_COURSES;
                courseService.coursesData.courseIndex = i + 1;
                const course = courseService.coursesData.coursesList[i];
                applicationService.applicationData.coursesCurrentDate = course.publishDate;
                await page.goto(course.courseURL, this.pageOptions);
                await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
                const postContent = await page.content();
                isErrorInARow = await domService.createCourseFullData({
                    course: course,
                    courseIndex: i,
                    courseContent: postContent
                });
                if (isErrorInARow) {
                    break;
                }
            }
        }
        catch (error) {
            logUtils.log(error);
        }
        await this.close(browser, true);
        return isErrorInARow;
    }

    async purchaseCourses() {
        const initiateCrawl = await this.initiateCrawl(false);
        // Login to Udemy.
        const afterLogin = await this.udemyLogin(initiateCrawl);
        if (afterLogin.exitReason) {
            return afterLogin.exitReason;
        }
        // Purchase courses.
        const afterPurchase = await this.udemyPurchases(afterLogin);
        // Logout from Udemy.
        const afterLogout = await this.udemyLogout(afterPurchase);
        if (afterLogout.exitReason) {
            return afterLogout.exitReason;
        }
        return null;
    }

    async udemyLogin(data) {
        // Login to Udemy.
        applicationService.applicationData.status = Status.LOGIN;
        const { browser, page } = data;
        try {
            let pageLoaded = false;
            let isPasswordRequiredOnly = false;
            for (let i = 0; i < countLimitService.countLimitData.maximumUdemyLoginAttemptsCount; i++) {
                // If no match for the email or password inputs, the page usually go to
                // "Prove you are human" or "Your browser too old" pages. Change the user agent
                // and reload the page should solve this issue.
                if (!await page.$(domService.loginEmailDOM) && !await page.$(domService.loginPasswordDOM)) {
                    await page.goto(applicationService.applicationData.udemyLoginURL, this.pageOptions);
                    await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
                }
                else if (!await page.$(domService.loginEmailDOM)) {
                    isPasswordRequiredOnly = true;
                    pageLoaded = true;
                }
                else {
                    pageLoaded = true;
                    break;
                }
                if (!pageLoaded && i > 0) {
                    await this.sleepAction();
                    await page.setUserAgent(crawlUtils.getRandomUserAgent());
                }
            }
            // If pages didn't loaded after number of attempts to reload, exit the program.
            if (!pageLoaded) {
                await this.close(browser, true);
                return { exitReason: Status.LOGIN_FAILED };
            }
            // Insert credentials and click login.
            await this.sleepAction();
            if (!isPasswordRequiredOnly) {
                await page.$eval(domService.loginEmailDOM, (el, value) => el.value = value, accountService.accountData.email);
                await this.sleepAction();
            }
            await page.$eval(domService.loginPasswordDOM, (el, value) => el.value = value, accountService.accountData.password);
            await this.sleepAction();
            await page.click(domService.loginButtonDOM);
            // After successfull login, turn on JavaScript in order to see all options.
            await page.setJavaScriptEnabled(true);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepAction();
            // Validate login was successfull.
            if (await page.$(domService.loginErrorDOM) || await page.$(domService.signInHeaderDOM)) {
                await this.close(browser, true);
                return { exitReason: Status.LOGIN_LOAD_FAILED };
            }
            await this.sleepAction();
        }
        catch (error) {
            logUtils.log(error);
        }
        return {
            browser: browser,
            page: page
        };
    }

    async udemyPurchases(data) {
        for (let i = 1; i <= countLimitService.countLimitData.maximumSessionsCount; i++) {
            applicationService.applicationData.sessionNumber = i;
            data = await this.udemyPurchasesSession(data);
            await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutBetweenCoursesPurchase);
        }
        return data;
    }

    async udemyPurchasesSession(data) {
        // Purchase courses at Udemy.
        let { browser, page } = data;
        for (let i = 0; i < courseService.coursesData.coursesList.length; i++) {
            applicationService.applicationData.status = Status.PURCHASE;
            courseService.coursesData.courseIndex = i + 1;
            const course = courseService.coursesData.coursesList[i];
            applicationService.applicationData.coursesCurrentDate = course.publishDate;
            courseService.coursesData.course = course;
            if (!course || !course.status) {
                continue;
            }
            // Validate course status.
            switch (course.status) {
                case CourseStatus.CREATE:
                case CourseStatus.PURCHASE_ERROR:
                case CourseStatus.FAIL: {
                    await globalUtils.sleep(10);
                    break;
                }
                default: { continue; }
            }
            // Validate course URL.
            if (!course.udemyURL) {
                courseService.coursesData.coursesList[i] = await courseService.updateCourseStatus({
                    course: course,
                    status: CourseStatus.EMPTY_URL,
                    details: 'The udemyURL is empty.'
                });
                continue;
            }
            // Validate that page exists.
            if (!page) {
                return {
                    page: page,
                    browser: browser,
                    exitReason: Status.UNEXPECTED_ERROR
                };
            }
            // Purchase the course.
            const purchaseResult = await this.udemyPurchase({
                page: page,
                course: course
            });
            page = purchaseResult.page;
            courseService.coursesData.coursesList[i] = purchaseResult.course;
            courseService.coursesData.course = purchaseResult.course;
            // Check if not error in a row.
            if (purchaseResult.isErrorInARow) {
                return {
                    page: page,
                    browser: browser,
                    exitReason: Status.PURCHASE_ERROR_IN_A_ROW
                };
            }
            // Check if not exceeded purchase count limit.
            if (this.checkPurchasedCount(purchaseResult.course.status)) {
                return {
                    page: page,
                    browser: browser,
                    exitReason: Status.PURCHASE_LIMIT_EXCEEDED
                };
            }
            applicationService.applicationData.status = Status.PAUSE;
            await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutBetweenCoursesPurchase);
        }
        return {
            page: page,
            browser: browser
        };
    }

    async udemyPurchase(data) {
        const { page, course } = data;
        try {
            this.logSessionURL(course.udemyURL);
            await this.sleepAction();
            // Go to the course's page.
            await page.goto(course.udemyURL, this.pageOptions);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepLoad();
            this.logSessionStage('LOAD');
            // Validate if page exists.
            if (await page.$(domService.courseNotExistsDOM)) {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.PAGE_NOT_FOUND,
                    details: 'Course page does not found, no such course.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE EXISTS');
            // Validate if the course exists.
            if (await page.$(domService.courseLimitAccessDOM)) {
                let status = null;
                let details = null;
                const courseH2 = await page.$eval(domService.courseLimitAccessDOM, el => el.textContent);
                if (courseH2.indexOf('available') > -1) {
                    status = CourseStatus.NOT_EXISTS;
                    details = 'The course is no longer available.';
                }
                if (courseH2.indexOf('enrollments') > -1) {
                    status = CourseStatus.LIMIT_ACCESS;
                    details = 'The course is no longer accepting enrollments.';
                }
                return await this.setCourseStatus({
                    page: page, course: course, status: status,
                    details: details, originalPrices: null
                });
            }
            this.logSessionStage('PAGE NOT LIMIT ACCESS');
            // Validate if this is not course list suggestions.
            if (await page.$(domService.coursesSuggestListDOM)) {
                const courseH1 = await page.$eval(domService.coursesSuggestListDOM, el => el.textContent);
                const courseBackground = await page.$(domService.courseBackgroundDOM);
                if (!courseBackground && courseH1.indexOf('Courses') > -1) {
                    return await this.setCourseStatus({
                        page: page, course: course, status: CourseStatus.SUGGESTIONS_LIST,
                        details: 'Course page is not purchasable, it\'s a courses list suggestions page.', originalPrices: null
                    });
                }
            }
            this.logSessionStage('PAGE NOT SUGGESTIONS LIST');
            // Validate that course is not private.
            if (await page.$(domService.courseIsPrivateDOM)) {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.PRIVATE,
                    details: 'Course page is private. It has lock icon button.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE NOT PRIVATE');
            // Validate that enroll button exists.
            const enrollButton = await page.$(domService.courseEnrollButtonDOM);
            if (enrollButton) {
                const enrollButtonText = await page.$eval(domService.courseEnrollButtonDOM, el => el.textContent);
                if (enrollButtonText.indexOf('Go to course') > -1) {
                    return await this.setCourseStatus({
                        page: page, course: course, status: CourseStatus.ALREADY_PURCHASE,
                        details: 'The course already purchased in tha past. No price label exists.', originalPrices: null
                    });
                }
            }
            else {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.ENROLL_NOT_EXISTS,
                    details: 'Can\'t purchase the course, because the enroll button not exists.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE HAS ENROLL BUTTON');
            // Validate that the course not already purchase.
            if (!await page.$(domService.coursePriceLabelDOM)) {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.ALREADY_PURCHASE,
                    details: 'The course already purchased in tha past. No price label exists.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE HAS PRICE LABEL 1');
            const coursePriceLabel = await page.$eval(domService.coursePriceLabelDOM, el => el.textContent);
            if (!coursePriceLabel) {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.ALREADY_PURCHASE,
                    details: 'The course already purchased in tha past. No price label exists.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE HAS PRICE LABEL 2');
            // Validate that the course is free.
            if (coursePriceLabel.indexOf('Free') === -1) {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.COURSE_PRICE_NOT_FREE,
                    details: 'The course price is not free. The keyword \'Free\' doesn\'t exists in the price label.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE HAS FREE');
            // Get the course original price.
            let originalPrices = null;
            if (await page.$(domService.courseOriginalPriceDOM)) {
                const courseOriginalPriceLabel = await page.$eval(domService.courseOriginalPriceDOM, el => el.textContent);
                if (courseOriginalPriceLabel) {
                    // Get the prices from the label and save them.
                    originalPrices = courseUtils.getCoursePrices(courseOriginalPriceLabel);
                }
            }
            this.logSessionStage('PAGE PASS ORIGINAL PRICE');
            // Enroll the course and go to the checkout page.
            await this.sleepAction();
            await page.evaluate((courseEnrollButtonDOM) => {
                document.querySelector(courseEnrollButtonDOM).click();
            }, domService.courseEnrollButtonDOM);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepLoad();
            this.logSessionStage('AFTER CLICK ENROLL BUTTON');
            // Possible that is a course without checkout page. Validate it.
            if (await page.$(domService.purchaseSuccessDOM)) {
                // Course has no checkout page and has been purchased.
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.PURCHASE,
                    details: 'Course has been purchased successfully.', originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE NOT PURCHASED YET');
            // In the checkout page, Validate that price exists.
            if (!await page.$(domService.checkoutPriceDOM)) {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.CHECKOUT_PRICE_NOT_EXISTS,
                    details: 'Course\'s price in checkout page doesn\'t exists. No checkout price label exists.', originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE HAS CHECKOUT PRICE 1');
            // In the checkout page, Validate that the total price is 0.00.
            const checkoutPriceLabel = await page.$eval(domService.checkoutPriceDOM, el => el.textContent);
            if (!checkoutPriceLabel) {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.CHECKOUT_PRICE_NOT_EXISTS,
                    details: 'Course\'s price in checkout page doesn\'t exists. No checkout price label exists.', originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE HAS CHECKOUT PRICE 2');
            const { priceNumber } = courseUtils.getCoursePrices(checkoutPriceLabel);
            if (priceNumber > 0) {
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.CHECKOUT_PRICE_NOT_FREE,
                    details: `Course's priceNumber in checkout not equal to 0, but priceNumber equal to ${priceNumber}.`, originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE CHECKOUT PRICE IS 0.00');
            // Purchase the course.
            await page.evaluate((purchaseButtonDOM) => {
                document.querySelector(purchaseButtonDOM).click();
            }, domService.purchaseButtonDOM);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepLoad();
            this.logSessionStage('AFTER PURCHASE BUTTON CLICK');
            // Validate purchase success.
            this.validateErrorInARow(false);
            if (await page.$(domService.purchaseSuccessDOM)) {
                this.logSessionStage('PURCHASE SUCCESS');
                // Course has been purchased successfully.
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.PURCHASE,
                    details: 'Course has been purchased successfully.', originalPrices: originalPrices
                });
            }
            else {
                // Something went wrong with the purchase.
                this.logSessionStage('PURCHASE FAIL');
                return await this.setCourseStatus({
                    page: page, course: course, status: CourseStatus.FAIL,
                    details: 'The purchase has failed. Successfully purchase label does not exists.', originalPrices: originalPrices
                });
            }
        }
        catch (error) {
            const errorDetails = systemUtils.getErrorDetails(error);
            this.logSessionStage(`PURCHASE ERROR: ${errorDetails}`);
            return await this.setCourseStatus({
                page: page, course: course, status: CourseStatus.PURCHASE_ERROR,
                details: `Unexpected error occurred durning the purchase process. More details: ${errorDetails}`, originalPrices: null
            });
        }
    }

    async setCourseStatus(data) {
        const { page, status, details, originalPrices } = data;
        let { course } = data;
        course = await courseService.updateCourseStatus({
            course: course,
            status: status,
            details: details
        });
        if (originalPrices) {
            course = courseService.updateCoursePrices(course, originalPrices);
        }
        if (applicationService.applicationData.mode === Mode.SESSION) {
            logUtils.log(course);
        }
        const isErrorInARow = this.validateErrorInARow(status === CourseStatus.PURCHASE_ERROR);
        return {
            page: page,
            course: course,
            isErrorInARow: isErrorInARow
        };
    }

    checkPurchasedCount(status) {
        if (status !== CourseStatus.PURCHASE) {
            return false;
        }
        courseService.coursesData.totalPurchasedCount++;
        return courseService.coursesData.totalPurchasedCount >= countLimitService.countLimitData.maximumCoursesPurchaseCount;
    }

    async udemyLogout(data) {
        // Logout from Udemy.
        applicationService.applicationData.status = Status.LOGOUT;
        const { browser, page, exitReason } = data;
        try {
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepAction();
            const urls = await page.$$eval(domService.href, a => a.map(url => url.href));
            const urlIndex = urls.findIndex(url => url.indexOf(applicationService.applicationData.udemyLogoutURL) > -1);
            if (urlIndex === -1) {
                await this.close(browser, true);
                return { exitReason: Status.LOGOUT_FAILED };
            }
            await page.goto(urls[urlIndex], this.pageOptions);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepAction();
            await this.close(browser, true);
        }
        catch (error) {
            logUtils.log(error);
        }
        return {
            browser: browser,
            page: page,
            exitReason: exitReason
        };
    }

    logSessionStage(stageName) {
        if (applicationService.applicationData.mode === Mode.SESSION) {
            logUtils.log(stageName);
        }
    }

    logSessionURL(url) {
        if (applicationService.applicationData.mode === Mode.SESSION) {
            logUtils.log(url);
        }
    }

    validateErrorInARow(isError) {
        if (isError) {
            this.purchaseErrorInARowCount++;
            return this.purchaseErrorInARowCount >= countLimitService.countLimitData.maximumPurchaseErrorInARowCount;
        }
        else {
            this.purchaseErrorInARowCount = 0;
        }
        return false;
    }

    async sleepAction() {
        await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutUdemyActions);
    }

    async sleepLoad() {
        await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutUdemyPageLoad);
    }

    async close(browser, isPlannedClose) {
        this.isPlannedClose = isPlannedClose;
        if (browser) {
            try {
                await browser.close();
            }
            catch (error) { }
        }
    }
}

module.exports = new PuppeteerService(); */