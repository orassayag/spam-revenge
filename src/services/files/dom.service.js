const jsdom = require('jsdom');
const { CourseStatus } = require('../../core/enums');
const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const courseService = require('./course.service');
const { courseUtils, systemUtils, textUtils, timeUtils, validationUtils } = require('../../utils');
const globalUtils = require('../../utils/files/global.utils');

class DomService {

    constructor() {
        this.createUpdateErrorsInARowCount = 0;
        // ===DOM=== //
        this.href = 'a';
        this.img = 'img';
        // ===COURSE=== //
        this.postDOM = '[id^="post-"]';
        this.singleCourseTitleDOM = 'grid-tit';
        this.singleCourseDateDOM = 'meta';
        this.singleCourseUdemyAttributeDOM = 'data-coupon-id';
        this.coursesListTitleDOM = 'course_title';
        this.coursesListContainerDOM = 'amz-deal';
        // ===UDEMY=== //
        this.loginEmailDOM = '#id_email';
        this.loginPasswordDOM = '#id_password';
        this.loginButtonDOM = '#submit-id-submit';
        this.signInHeaderDOM = '[data-purpose="header-login"]';
        this.loginErrorDOM = '.js-error-alert';
        this.courseBackgroundDOM = '.dark-background';
        this.courseNotExistsDOM = '.error__greeting';
        this.courseLimitAccessDOM = '[data-purpose="safely-set-inner-html:limited-access-container:title"]';
        this.coursePriceLabelDOM = '[data-purpose="course-price-text"]';
        this.coursesSuggestListDOM = '.udlite-heading-xxl';
        this.courseIsPrivateDOM = '.udi-lock';
        this.courseOriginalPriceDOM = '[data-purpose="course-old-price-text"]';
        this.courseEnrollButtonDOM = '[data-purpose="buy-this-course-button"]';
        this.checkoutPriceDOM = '[data-purpose="total-price"]';
        this.purchaseButtonDOM = '.btn-block';
        this.purchaseSuccessDOM = '.alert-success';
    }

    async createSingleCourses(data) {
        let coursesCount = 0;
        try {
            const { mainContent, pageNumber, indexPageNumber, indexDate } = data;
            const dom = new jsdom.JSDOM(mainContent);
            const courses = dom.window.document.querySelectorAll(this.postDOM);
            for (let i = 0; i < courses.length; i++) {
                const course = courses[i];
                const url = course.getElementsByClassName(this.singleCourseTitleDOM)[0]?.childNodes[0];
                const date = timeUtils.getDateFromString(course.getElementsByClassName(this.singleCourseDateDOM)[0]?.childNodes[2]?.data?.trim());
                await courseService.createCourse({
                    postId: parseInt(course.id.split('-')[1]),
                    pageNumber: pageNumber,
                    indexPageNumber: indexPageNumber,
                    isFree: null,
                    courseURL: url?.href,
                    udemyURL: null,
                    couponKey: null,
                    courseURLCourseName: url?.text,
                    publishDate: date,
                    indexDate: indexDate,
                    isSingleCourse: true
                });
                await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutBetweenCoursesCreate);
            }
            coursesCount = courses.length;
            this.validateErrorInARow(false);
            return {
                coursesCount: coursesCount,
                isErrorInARow: false
            };
        }
        catch (error) {
            console.log(error);
            if (this.validateErrorInARow(true)) {
                return {
                    coursesCount: coursesCount,
                    isErrorInARow: true
                };
            }
        }
    }

    async createCourseFullData(data) {
        const { course, courseIndex, courseContent } = data;
        const coursesLists = [];
        try {
            const dom = new jsdom.JSDOM(courseContent);
            const urls = dom.window.document.getElementsByTagName(this.href);
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                const isDirectUdemyURL = url.hasAttribute(this.singleCourseUdemyAttributeDOM);
                const urlHref = url.href;
                if (!isDirectUdemyURL && urlHref.indexOf(applicationService.applicationData.udemyBaseURL) > -1) {
                    coursesLists.push({
                        course: course,
                        courseIndex: courseIndex,
                        dom: dom
                    });
                    break;
                }
                if (isDirectUdemyURL || urlHref.indexOf(applicationService.applicationData.singleCourseInit) > -1) {
                    if (isDirectUdemyURL || !url.getElementsByTagName(this.img).length) {
                        const result = courseUtils.createCourseSingleData(urlHref);
                        await courseService.updateSingleCourseData({
                            course: course,
                            courseIndex: courseIndex,
                            udemyURL: result.udemyURL,
                            udemyURLCompare: textUtils.toLowerCaseTrim(result.udemyURL),
                            couponKey: result.couponKey
                        });
                        await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutBetweenCoursesUpdate);
                        break;
                    }
                }
            }
            if (validationUtils.isExists(coursesLists)) {
                await this.createCoursesList(coursesLists);
            }
            return this.validateErrorInARow(false);
        }
        catch (error) {
            courseService.coursesData.coursesList[courseIndex] = await this.setCourseError(error, course);
            if (this.validateErrorInARow(true)) {
                return true;
            }
        }
    }

    async createCoursesListWithNames(data) {
        const { course, courseIndex, date, coursesDOMList } = data;
        try {
            for (let i = 0; i < coursesDOMList.length; i++) {
                const innerCourse = coursesDOMList[i];
                const url = innerCourse.getElementsByClassName(this.coursesListTitleDOM)[0];
                const udemyURL = url?.href;
                if (!this.isValidateUdemyURL(udemyURL)) {
                    continue;
                }
                const couponKey = courseUtils.getCourseCoupon(udemyURL);
                await courseService.createCourse({
                    postId: null,
                    pageNumber: course.pageNumber,
                    indexPageNumber: course.indexPageNumber,
                    isFree: !validationUtils.isExists(couponKey),
                    courseURL: course.courseURL,
                    udemyURL: udemyURL,
                    udemyURLCompare: textUtils.toLowerCaseTrim(udemyURL),
                    couponKey: courseUtils.getCourseCoupon(udemyURL),
                    courseURLCourseName: url?.text,
                    publishDate: date,
                    dateIndex: course.dateIndex,
                    isSingleCourse: false
                });
                await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutBetweenCoursesCreate);
                if (this.validateErrorInARow(false)) {
                    return true;
                }
            }
        }
        catch (error) {
            courseService.coursesData.coursesList[courseIndex] = await this.setCourseError(error, course);
            if (this.validateErrorInARow(true)) {
                return true;
            }
        }
    }

    async createCoursesListWithoutNames(data) {
        const { course, courseIndex, date, courseURLsList } = data;
        try {
            for (let i = 0; i < courseURLsList.length; i++) {
                const udemyURL = courseURLsList[i]?.href;
                if (!this.isValidateUdemyURL(udemyURL)) {
                    continue;
                }
                const couponKey = courseUtils.getCourseCoupon(udemyURL);
                await courseService.createCourse({
                    postId: null,
                    pageNumber: course.pageNumber,
                    indexPageNumber: course.indexPageNumber,
                    isFree: !validationUtils.isExists(couponKey),
                    courseURL: course.courseURL,
                    udemyURL: udemyURL,
                    udemyURLCompare: textUtils.toLowerCaseTrim(udemyURL),
                    couponKey: courseUtils.getCourseCoupon(udemyURL),
                    courseURLCourseName: null,
                    publishDate: date,
                    dateIndex: course.dateIndex,
                    isSingleCourse: false
                });
                await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutBetweenCoursesCreate);
                if (this.validateErrorInARow(false)) {
                    return true;
                }
            }
        }
        catch (error) {
            courseService.coursesData.coursesList[courseIndex] = await this.setCourseError(error, course);
            if (this.validateErrorInARow(true)) {
                return true;
            }
        }
    }

    async createCoursesList(coursesLists) {
        let isErrorInARow = false;
        for (let i = 0; i < coursesLists.length; i++) {
            const { course, courseIndex, dom } = coursesLists[i];
            try {
                const date = timeUtils.getDateFromString(dom.window.document.getElementsByClassName(this.singleCourseDateDOM)[0]?.childNodes[2]?.data?.trim());
                const coursesDOMList = dom.window.document.getElementsByClassName(this.coursesListContainerDOM);
                if (validationUtils.isExists(coursesDOMList)) {
                    if (await this.createCoursesListWithNames({
                        course: course,
                        courseIndex: courseIndex,
                        date: date,
                        coursesDOMList: coursesDOMList
                    })) {
                        isErrorInARow = true;
                        break;
                    }
                }
                else {
                    if (await this.createCoursesListWithoutNames({
                        course: course,
                        courseIndex: courseIndex,
                        date: date,
                        courseURLsList: dom.window.document.getElementsByTagName(this.href)
                    })) {
                        isErrorInARow = true;
                        break;
                    }
                }
                await courseService.updateCoursesListCourseData({
                    course: course,
                    courseIndex: courseIndex
                });
                return isErrorInARow ? isErrorInARow : this.validateErrorInARow(false);
            }
            catch (error) {
                courseService.coursesData.coursesList[courseIndex] = await this.setCourseError(error, course);
                if (this.validateErrorInARow(true)) {
                    return true;
                }
            }
        }
    }

    validateErrorInARow(isError) {
        if (isError) {
            this.createUpdateErrorsInARowCount++;
            return this.createUpdateErrorsInARowCount >= countLimitService.countLimitData.maximumCreateUpdateErrorInARowCount;
        }
        else {
            this.createUpdateErrorsInARowCount = 0;
        }
        return false;
    }

    async setCourseError(error, course) {
        return await courseService.updateCourseStatus({
            course: course, status: CourseStatus.CREATE_UPDATE_ERROR,
            details: `Unexpected error occurred durning the create update process. More details: ${systemUtils.getErrorDetails(error)}`
        });
    }

    isValidateUdemyURL(udemyURL) {
        return udemyURL && udemyURL.indexOf(applicationService.applicationData.udemyBaseURL) > -1;
    }
}

module.exports = new DomService();