const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const { CourseData, CoursesData, CoursesDatesResult } = require('../../core/models');
const { CoursesDatesType, CourseStatus, CourseType, Status } = require('../../core/enums');
const { courseUtils, textUtils, timeUtils, validationUtils } = require('../../utils');

class CourseService {

    constructor() {
        this.coursesData = new CoursesData();
        this.lastCourseId = 1;
        this.logCourse = null;
    }

    initiate(logCourse) {
        if (validationUtils.isExists(applicationService.applicationData.keyWordsFilterList)) {
            for (let i = 0; i < applicationService.applicationData.keyWordsFilterList.length; i++) {
                applicationService.applicationData.keyWordsFilterList[i] = textUtils.toLowerCaseTrim(applicationService.applicationData.keyWordsFilterList[i]);
            }
        }
        this.logCourse = logCourse;
    }

    updateCoursesDatesResult(coursesDatesResult, coursesDatesType) {
        coursesDatesResult.coursesDatesType = coursesDatesType;
        coursesDatesResult.coursesDatesValue = [...new Set(coursesDatesResult.coursesDatesValue)];
        const dates = coursesDatesResult.coursesDatesValue.slice(0, countLimitService.countLimitData.maximumCoursesDatesDisplayCount);
        coursesDatesResult.coursesDatesDisplayValue = dates.join(' | ');
        coursesDatesResult.coursesDatesLogName = textUtils.replaceCharacter(dates.join('-'), '/', '');
        return coursesDatesResult;
    }

    validateCoursesDatesValue(coursesDatesValue) {
        const errorBaseTemplate = 'Invalid COURSES_DATES_VALUE parameter was found:';
        let coursesDatesResult = new CoursesDatesResult();
        switch (textUtils.getVariableType(coursesDatesValue)) {
            case 'string': {
                if (!validationUtils.isValidDateFormat(coursesDatesValue)) {
                    coursesDatesResult.coursesError = `${errorBaseTemplate} Excpected a Date (yyyy/mm/dd) but received: ${coursesDatesValue} (1000006)`;
                    return coursesDatesResult;
                }
                coursesDatesResult.coursesDatesType = CoursesDatesType.SINGLE;
                coursesDatesResult.coursesDatesValue = [coursesDatesValue];
                coursesDatesResult.coursesDatesDisplayValue = coursesDatesValue;
                coursesDatesResult.coursesDatesLogName = timeUtils.getDateNoSpacesFromString(coursesDatesValue);
                break;
            }
            case 'array': {
                coursesDatesResult.coursesDatesValue = [];
                for (let i = 0; i < coursesDatesValue.length; i++) {
                    const coursesDate = coursesDatesValue[i];
                    if (validationUtils.isValidDateFormat(coursesDate)) {
                        coursesDatesResult.coursesDatesValue.push(coursesDate);
                    }
                }
                if (!validationUtils.isExists(coursesDatesResult.coursesDatesValue)) {
                    coursesDatesResult.coursesError = `${errorBaseTemplate} Array is empty or contains invalid dates: ${coursesDatesValue} (1000007)`;
                    return coursesDatesResult;
                }
                coursesDatesResult = this.updateCoursesDatesResult(coursesDatesResult, CoursesDatesType.ARRAY);
                break;
            }
            case 'object': {
                coursesDatesResult.coursesDatesValue = timeUtils.getAllDatesBetweenDates({
                    startDateTime: coursesDatesValue.from,
                    endDateTime: coursesDatesValue.to
                });
                if (!validationUtils.isExists(coursesDatesResult.coursesDatesValue)) {
                    coursesDatesResult.coursesError = `${errorBaseTemplate} Object is empty or contains invalid dates: ${coursesDatesValue} (1000008)`;
                    return coursesDatesResult;
                }
                coursesDatesResult = this.updateCoursesDatesResult(coursesDatesResult, CoursesDatesType.RANGE);
                break;
            }
        }
        if (!coursesDatesResult.coursesDatesType) {
            coursesDatesResult.coursesError = `${errorBaseTemplate} Expected string, array, or object. Received: ${coursesDatesValue} (1000009)`;
            return coursesDatesResult;
        }
        return coursesDatesResult;
    }

    getUdemyCourseName(udemyURL) {
        if (!udemyURL) {
            return null;
        }
        udemyURL = udemyURL.replace(applicationService.applicationData.udemyCourseURL, '');
        udemyURL = udemyURL.slice(0, udemyURL.indexOf('/'));
        return textUtils.getCapitalEachWordFromURL(udemyURL);
    }

    async validateUdemyURL(course) {
        const { udemyURL } = course;
        if (!udemyURL) {
            return course;
        }
        if (udemyURL.indexOf(applicationService.applicationData.udemyBaseURL) === -1) {
            course = await this.updateCourseStatus({
                course: course,
                status: CourseStatus.INVALID_URL,
                details: 'The Udemy URL is invalid.'
            });
        }
        return course;
    }

    async createCourse(course) {
        course.id = this.lastCourseId;
        if (course.isSingleCourse) {
            this.coursesData.totalSingleCount++;
        }
        else {
            this.coursesData.totalCourseListCount++;
        }
        course = new CourseData(course);
        course.udemyURLCourseName = this.getUdemyCourseName(course.udemyURL);
        course = await this.validateUdemyURL(course);
        this.coursesData.coursesList.push(course);
        this.lastCourseId++;
        this.coursesData.course = course;
        await this.logCourse(course);
    }

    async updateSingleCourseData(data) {
        const { courseIndex, udemyURL, udemyURLCompare, couponKey } = data;
        let { course } = data;
        course.udemyURL = udemyURL;
        course.udemyURLCompare = udemyURLCompare;
        course.udemyURLCourseName = this.getUdemyCourseName(udemyURL);
        course.couponKey = couponKey;
        course.isFree = !validationUtils.isExists(couponKey);
        course = await this.validateUdemyURL(course);
        this.coursesData.coursesList[courseIndex] = course;
        this.coursesData.course = course;
        await this.logCourse(course);
    }

    async updateCoursesListCourseData(data) {
        const { course, courseIndex } = data;
        course.isFree = false;
        this.coursesData.coursesList[courseIndex] = course;
        this.coursesData.course = course;
        await this.logCourse(course);
    }

    async updateCourseStatus(data) {
        const { course, status, details } = data;
        const originalStatus = course.status;
        course.status = status;
        course.resultDateTime = new Date();
        course.resultDetails.push(details);
        if (originalStatus !== CourseStatus.CREATE) {
            this.coursesData.updateCount(false, originalStatus, 1);
        }
        this.coursesData.updateCount(true, status, 1);
        this.coursesData.course = course;
        await this.logCourse(course);
        return course;
    }

    updateCoursePrices(course, originalPrices) {
        if (originalPrices) {
            course.priceNumber = originalPrices.priceNumber;
            course.priceDisplay = originalPrices.priceDisplay;
            this.coursesData.totalPriceNumber += originalPrices.priceNumber;
        }
        return course;
    }

    async finalizeCreateUpdateCourses() {
        // Validate any courses exists to purchase.
        if (this.coursesData.coursesList.length <= 0) {
            return Status.NO_COURSES_EXISTS;
        }
        for (let i = 0; i < this.coursesData.coursesList.length; i++) {
            const course = this.coursesData.coursesList[i];
            // Validate all fields.
            let scanFieldsResult = this.validate(course);
            if (scanFieldsResult) {
                this.coursesData.coursesList[i] = await this.updateCourseStatus({
                    course: course,
                    status: scanFieldsResult.status,
                    details: scanFieldsResult.details
                });
            }
            if (validationUtils.isExists(applicationService.applicationData.keyWordsFilterList)) {
                if (this.filter(course)) {
                    this.coursesData.coursesList[i] = await this.updateCourseStatus({
                        course: course,
                        status: CourseStatus.FILTER,
                        details: 'The course has been filtered since no entered key words has been found match to the course name.'
                    });
                }
            }
            // Compare courses and detect duplicates.
            await this.compare(course);
        }
        // Validate that there are any courses to purchase.
        if (this.coursesData.coursesList.map(c => c.status === CourseStatus.CREATE).length <= 0) {
            return Status.NO_VALID_COURSES_EXISTS;
        }
    }

    validate(course) {
        // Validate all expected fields.
        let scanFieldsResult = this.scanFields({
            course: course,
            keysList: ['id', 'creationDateTime', 'pageNumber', 'publishDate', 'type', 'isFree', 'courseURL', 'status'],
            isExpectedFilled: true
        });
        if (!scanFieldsResult) {
            return scanFieldsResult;
        }
        // Validate all unexpected fields.
        scanFieldsResult = this.scanFields({
            course: course,
            keysList: ['priceNumber', 'priceDisplay', 'resultDateTime', 'resultDetails'],
            isExpectedFilled: false
        });
        if (!scanFieldsResult) {
            return scanFieldsResult;
        }
        // Validate Udemy URL.
        const { type, isFree, udemyURL, couponKey, status } = course;
        if (udemyURL) {
            if (udemyURL.indexOf(applicationService.applicationData.udemyBaseURL) === -1) {
                return {
                    status: CourseStatus.INVALID,
                    details: 'Field udemyURL does not match as Udemy website.'
                };
            }
        }
        else if (type === CourseType.SINGLE && status === CourseStatus.CREATE) {
            return {
                status: CourseStatus.INVALID,
                details: 'Field udemyURL is empty and the course is not in the type of COURSES_LIST.'
            };
        }
        // Validate free course coupon or free course originally.
        if (isFree && couponKey) {
            return {
                status: CourseStatus.INVALID,
                details: 'Field isFree set to true, but couponKey field is not empty.'
            };
        }
        return null;
    }

    filter(course) {
        const { udemyURLCompare, status } = course;
        if (!udemyURLCompare || status !== CourseStatus.CREATE) {
            return true;
        }
        const udemyKeyWords = courseUtils.getUdemyURLKeyWords(udemyURLCompare, applicationService.applicationData.udemyBaseURL);
        if (!validationUtils.isExists(udemyKeyWords)) {
            return true;
        }
        for (let i = 0; i < applicationService.applicationData.keyWordsFilterList.length; i++) {
            const keyWord = applicationService.applicationData.keyWordsFilterList[i];
            for (let y = 0; y < udemyKeyWords.length; y++) {
                if (keyWord === udemyKeyWords[y]) {
                    return false;
                }
            }
        }
        return true;
    }

    scanFields(data) {
        const { course, keysList, isExpectedFilled } = data;
        let scanFieldsResult = null;
        for (let i = 0; i < keysList.length; i++) {
            const key = keysList[i];
            const value = course[key];
            if (isExpectedFilled) {
                if (!value) {
                    scanFieldsResult = {
                        status: CourseStatus.MISSING_FIELD,
                        details: `Field ${key} should not be empty, but does not contain any value.`
                    };
                    break;
                }
            }
            else {
                if (value) {
                    scanFieldsResult = {
                        status: CourseStatus.UNEXPECTED_FIELD,
                        details: `Field ${key} should be empty, but found the value ${value}.`
                    };
                    break;
                }
            }
        }
        return scanFieldsResult;
    }

    async compare(course) {
        // Check if duplicate courses exists, not to enter Udemy course page several times.
        if (course.status !== CourseStatus.CREATE) {
            return;
        }
        for (let i = 0; i < this.coursesData.coursesList.length; i++) {
            const currentCourse = this.coursesData.coursesList[i];
            if (course.id === currentCourse.id || currentCourse.status !== CourseStatus.CREATE) {
                continue;
            }
            if (course.udemyURLCompare === currentCourse.udemyURLCompare) {
                this.coursesData.coursesList[i] = await this.updateCourseStatus({
                    course: currentCourse,
                    status: CourseStatus.DUPLICATE,
                    details: 'This course repeats multiple times in this session and should be purchased.'
                });
            }
        }
    }

    createSessionCourses(urls) {
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            this.coursesData.coursesList.push(new CourseData({
                id: this.lastCourseId,
                postId: null,
                pageNumber: 1,
                indexPageNumber: 1,
                isFree: false,
                courseURL: null,
                udemyURL: url,
                udemyURLCompare: textUtils.toLowerCaseTrim(url),
                couponKey: null,
                courseURLCourseName: null,
                publishDate: null,
                isSingleCourse: true
            }));
            this.lastCourseId++;
        }
    }
}

module.exports = new CourseService();