class CountLimitData {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { MAXIMUM_EMAIL_ADDRESSSES_COUNT, MAXIMUM_SUBSRIBES_COUNT, MILLISECONDS_TIMEOUT_EXIT_APPLICATION } = settings;
		this.maximumEmailAddressesCount = MAXIMUM_EMAIL_ADDRESSSES_COUNT;
		this.maximumSubscribesCount = MAXIMUM_SUBSRIBES_COUNT;
		this.millisecondsTimeoutExitApplication = MILLISECONDS_TIMEOUT_EXIT_APPLICATION;
	}
}

module.exports = CountLimitData;

/* 		    // Determine how many email addresses to subscribe to all the subscribes. Will take the first if exceeded.
			MAXIMUM_EMAIL_ADDRESSSES_COUNT: 10,
			// Determine how many subscribes to subscribe each email address. Will take the first if exceeded.
			MAXIMUM_SUBSRIBES_COUNT: 2000, */
/* 		// Set the parameters from the settings file.
		const { MAXIMUM_COURSES_PURCHASE_COUNT, MILLISECONDS_TIMEOUT_SOURCE_REQUEST_COUNT, MAXIMUM_PAGES_NUMBER, MAXIMUM_SESSIONS_COUNT,
			MILLISECONDS_INTERVAL_COUNT, MILLISECONDS_TIMEOUT_BETWEEN_COURSES_CREATE, MILLISECONDS_TIMEOUT_BETWEEN_COURSES_MAIN_PAGES,
			MILLISECONDS_TIMEOUT_BETWEEN_COURSES_UPDATE, MAXIMUM_COURSE_NAME_CHARACTERS_DISPLAY_COUNT, MAXIMUM_URL_CHARACTERS_DISPLAY_COUNT,
			MAXIMUM_RESULT_CHARACTERS_DISPLAY_COUNT, MILLISECONDS_TIMEOUT_UDEMY_ACTIONS, MAXIMUM_UDEMY_LOGIN_ATTEMPTS_COUNT,
			MILLISECONDS_TIMEOUT_BETWEEN_COURSES_PURCHASE, MILLISECONDS_TIMEOUT_UDEMY_PAGE_LOAD, MAXIMUM_CREATE_UPDATE_ERROR_IN_A_ROW_COUNT,
			MAXIMUM_PURCHASE_ERROR_IN_A_ROW_COUNT, MILLISECONDS_TIMEOUT_EXIT_APPLICATION, MAXIMUM_URL_VALIDATION_COUNT,
			MILLISECONDS_TIMEOUT_URL_VALIDATION, MAXIMUM_COURSES_DATES_DISPLAY_COUNT } = settings;
		this.maximumCoursesPurchaseCount = MAXIMUM_COURSES_PURCHASE_COUNT;
		this.millisecondsTimeoutSourceRequestCount = MILLISECONDS_TIMEOUT_SOURCE_REQUEST_COUNT;
		this.maximumPagesNumber = MAXIMUM_PAGES_NUMBER;
		this.maximumSessionsCount = MAXIMUM_SESSIONS_COUNT;
		this.millisecondsIntervalCount = MILLISECONDS_INTERVAL_COUNT;
		this.millisecondsTimeoutBetweenCoursesCreate = MILLISECONDS_TIMEOUT_BETWEEN_COURSES_CREATE;
		this.millisecondsTimeoutBetweenCoursesMainPages = MILLISECONDS_TIMEOUT_BETWEEN_COURSES_MAIN_PAGES;
		this.millisecondsTimeoutBetweenCoursesUpdate = MILLISECONDS_TIMEOUT_BETWEEN_COURSES_UPDATE;
		this.maximumCourseNameCharactersDisplayCount = MAXIMUM_COURSE_NAME_CHARACTERS_DISPLAY_COUNT;
		this.maximumURLCharactersDisplayCount = MAXIMUM_URL_CHARACTERS_DISPLAY_COUNT;
		this.maximumResultCharactersDisplayCount = MAXIMUM_RESULT_CHARACTERS_DISPLAY_COUNT;
		this.millisecondsTimeoutUdemyActions = MILLISECONDS_TIMEOUT_UDEMY_ACTIONS;
		this.maximumUdemyLoginAttemptsCount = MAXIMUM_UDEMY_LOGIN_ATTEMPTS_COUNT;
		this.millisecondsTimeoutBetweenCoursesPurchase = MILLISECONDS_TIMEOUT_BETWEEN_COURSES_PURCHASE;
		this.millisecondsTimeoutUdemyPageLoad = MILLISECONDS_TIMEOUT_UDEMY_PAGE_LOAD;
		this.maximumCreateUpdateErrorInARowCount = MAXIMUM_CREATE_UPDATE_ERROR_IN_A_ROW_COUNT;
		this.maximumPurchaseErrorInARowCount = MAXIMUM_PURCHASE_ERROR_IN_A_ROW_COUNT;
		this.millisecondsTimeoutExitApplication = MILLISECONDS_TIMEOUT_EXIT_APPLICATION;
		this.maximumURLValidationCount = MAXIMUM_URL_VALIDATION_COUNT;
		this.millisecondsTimeoutURLValidation = MILLISECONDS_TIMEOUT_URL_VALIDATION;
		this.maximumCoursesDatesDisplayCount = MAXIMUM_COURSES_DATES_DISPLAY_COUNT; */