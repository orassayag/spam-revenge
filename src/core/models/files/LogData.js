class LogData {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { IS_LOG_CREATE_COURSES_METHOD_VALID, IS_LOG_CREATE_COURSES_METHOD_INVALID, IS_LOG_UPDATE_COURSES_METHOD_VALID,
			IS_LOG_UPDATE_COURSES_METHOD_INVALID, IS_LOG_PURCHASE_COURSES_METHOD_VALID, IS_LOG_PURCHASE_COURSES_METHOD_INVALID } = settings;
		this.isLogCreateCoursesMethodValid = IS_LOG_CREATE_COURSES_METHOD_VALID;
		this.isLogCreateCoursesMethodInvalid = IS_LOG_CREATE_COURSES_METHOD_INVALID;
		this.isLogUpdateCoursesMethodValid = IS_LOG_UPDATE_COURSES_METHOD_VALID;
		this.isLogUpdateCoursesMethodInvalid = IS_LOG_UPDATE_COURSES_METHOD_INVALID;
		this.isLogPurchaseCoursesMethodValid = IS_LOG_PURCHASE_COURSES_METHOD_VALID;
		this.isLogPurchaseCoursesMethodInvalid = IS_LOG_PURCHASE_COURSES_METHOD_INVALID;
	}
}

module.exports = LogData;