const { applicationUtils, timeUtils } = require('../../../utils');

class ApplicationData {

	constructor(data) {
		// Set the parameters from the settings file.
		const { settings, status } = data;
		const { MODE, IS_PRODUCTION_ENVIRONMENT, VALIDATION_CONNECTION_LINK } = settings;
		this.isProductionEnvironment = IS_PRODUCTION_ENVIRONMENT;
		this.environment = applicationUtils.getApplicationEnvironment(this.isProductionEnvironment);
		this.mode = MODE;
		this.status = status;
		this.startDateTime = null;
		this.logDateTime = timeUtils.getFullDateNoSpaces();
		this.validationConnectionLink = VALIDATION_CONNECTION_LINK;
	}
}

module.exports = ApplicationData;

/* 		// Set the parameters from the settings file.
		const { settings, coursesDatesResult, status } = data;
		const { MODE, IS_PRODUCTION_ENVIRONMENT, COURSES_BASE_URL, UDEMY_BASE_URL, SINGLE_COURSE_INIT,
			SPECIFIC_COURSES_PAGE_NUMBER, IS_CREATE_COURSES_METHOD_ACTIVE, IS_UPDATE_COURSES_METHOD_ACTIVE,
			IS_PURCHASE_COURSES_METHOD_ACTIVE, KEY_WORDS_FILTER_LIST } = settings;
		const { coursesDatesType, coursesDatesValue, coursesDatesDisplayValue, coursesDatesLogName } = coursesDatesResult;
		this.isProductionEnvironment = IS_PRODUCTION_ENVIRONMENT;
		this.coursesBaseURL = COURSES_BASE_URL;
		this.udemyBaseURL = UDEMY_BASE_URL;
		this.singleCourseInit = SINGLE_COURSE_INIT;
		this.udemyLoginURL = `${this.udemyBaseURL}/join/login-popup/`;
		this.udemySuccessURL = `${this.udemyBaseURL}/cart/success/`;
		this.udemyLogoutURL = '/user/logout/';
		this.udemyCourseURL = `${this.udemyBaseURL}/course/`;
		this.specificCoursesPageNumber = SPECIFIC_COURSES_PAGE_NUMBER;
		this.keyWordsFilterList = KEY_WORDS_FILTER_LIST;
		this.isCreateCoursesMethodActive = IS_CREATE_COURSES_METHOD_ACTIVE;
		this.isUpdateCoursesMethodActive = IS_UPDATE_COURSES_METHOD_ACTIVE;
		this.isPurchaseCoursesMethodActive = IS_PURCHASE_COURSES_METHOD_ACTIVE;
		this.time = null;
		this.environment = applicationUtils.getApplicationEnvironment(this.isProductionEnvironment);
		this.mode = MODE;
		this.method = null;
		this.status = status;
		this.sessionNumber = 0;
		this.coursesDatesType = coursesDatesType;
		this.coursesDatesValue = coursesDatesValue;
		this.coursesDatesDisplayValue = coursesDatesDisplayValue;
		this.coursesCurrentDate = null;
		this.startDateTime = null;
		this.logDateTime = `${timeUtils.getFullDateNoSpaces()}_${coursesDatesLogName}`; */