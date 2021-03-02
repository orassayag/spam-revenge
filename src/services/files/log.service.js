const { LogData } = require('../../core/models');
const { Mode, Placeholder } = require('../../core/enums');
const applicationService = require('./application.service');
const pathService = require('./path.service');
const { fileUtils, pathUtils, textUtils, validationUtils } = require('../../utils');

class LogService {

	constructor() {
		this.isLogProgress = null;
		this.logData = null;
		this.logInterval = null;
		// ===PATH=== //
		this.baseSessionPath = null;
		this.sessionDirectoryPath = null;
		this.subscribeValidPath = null;
		this.subscribeInvalidPath = null;
		this.i = 0;
		this.frames = ['-', '\\', '|', '/'];
		this.emptyValue = '##';
		this.logSeperator = '==========';
		this.isLogs = true;
	}

	initiate(settings) {
		this.logData = new LogData(settings);
		// Check if any logs active.
		this.isLogs = applicationService.applicationData.mode === Mode.STANDARD &&
			(this.logData.isLogSubscribeValidPath || this.logData.isLogSubscribeInvalidPath);
		this.initiateDirectories();
		this.isLogProgress = applicationService.applicationData.mode === Mode.STANDARD;
	}

	initiateDirectories() {
		if (!this.isLogs) {
			return;
		}
		// ===PATH=== //
		this.baseSessionPath = pathService.pathData.distPath;
		this.createSessionDirectory();
		if (this.logData.isLogSubscribeValidPath) {
			this.subscribeValidPath = this.createFilePath(`subscribe_valid_${Placeholder.DATE}`);
		}
		if (this.logData.isLogSubscribeInvalidPath) {
			this.subscribeInvalidPath = this.createFilePath(`subscribe_invalid_${Placeholder.DATE}`);
		}
	}

	getNextDirectoryIndex() {
		const directories = fileUtils.getAllDirectories(this.baseSessionPath);
		if (!validationUtils.isExists(directories)) {
			return 1;
		}
		return Math.max(...directories.map(name => textUtils.getSplitNumber(name))) + 1;
	}

	createSessionDirectory() {
		this.sessionDirectoryPath = pathUtils.getJoinPath({
			targetPath: this.baseSessionPath,
			targetName: `${this.getNextDirectoryIndex()}_${applicationService.applicationData.logDateTime}`
		});
		fileUtils.createDirectory(this.sessionDirectoryPath);
	}

	createFilePath(fileName) {
		return pathUtils.getJoinPath({
			targetPath: this.sessionDirectoryPath ? this.sessionDirectoryPath : pathService.pathData.distPath,
			targetName: `${fileName.replace(Placeholder.DATE, applicationService.applicationData.logDateTime)}.txt`
		});
	}

	close() {
		if (this.logInterval) {
			clearInterval(this.logInterval);
		}
	}
}

module.exports = new LogService();

/* const { LogData } = require('../../core/models');
const { CourseStatusLog, CourseStatus, Color, Method, Mode, Placeholder, StatusIcon } = require('../../core/enums');
const accountService = require('./account.service');
const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const courseService = require('./course.service');
const domService = require('./dom.service');
const pathService = require('./path.service');
const puppeteerService = require('./puppeteer.service');
const { fileUtils, logUtils, pathUtils, textUtils, timeUtils, validationUtils } = require('../../utils');

class LogService {

	constructor() {
		this.isLogProgress = null;
		this.logData = null;
		this.logInterval = null;
		// ===PATH=== //
		this.baseSessionPath = null;
		this.sessionDirectoryPath = null;
		this.createCoursesValidPath = null;
		this.createCoursesInvalidPath = null;
		this.updateCoursesValidPath = null;
		this.updateCoursesInvalidPath = null;
		this.purchaseCoursesValidPath = null;
		this.purchaseCoursesInvalidPath = null;
		this.i = 0;
		this.frames = ['-', '\\', '|', '/'];
		this.emptyValue = '##';
		this.logSeperator = '==========';
		this.isLogs = true;
	}

	async initiate(settings) {
		this.logData = new LogData(settings);
		// Check if any logs active.
		this.isLogs = applicationService.applicationData.mode === Mode.STANDARD &&
			(this.logData.isLogCreateCoursesMethodValid || this.logData.isLogCreateCoursesMethodInvalid ||
				this.logData.isLogUpdateCoursesMethodValid || this.logData.isLogUpdateCoursesMethodInvalid ||
				this.logData.isLogPurchaseCoursesMethodValid || this.logData.isLogPurchaseCoursesMethodInvalid);
		await this.initiateDirectories();
		this.isLogProgress = applicationService.applicationData.mode === Mode.STANDARD;
	}

	async initiateDirectories() {
		if (!this.isLogs) {
			return;
		}
		// ===PATH=== //
		this.baseSessionPath = pathService.pathData.distPath;
		await this.createSessionDirectory();
		if (this.logData.isLogCreateCoursesMethodValid) {
			this.createCoursesValidPath = this.createFilePath(`create_courses_method_valid_${Placeholder.DATE}`);
		}
		if (this.logData.isLogCreateCoursesMethodInvalid) {
			this.createCoursesInvalidPath = this.createFilePath(`create_courses_method_invalid_${Placeholder.DATE}`);
		}
		if (this.logData.isLogUpdateCoursesMethodValid) {
			this.updateCoursesValidPath = this.createFilePath(`update_courses_method_valid_${Placeholder.DATE}`);
		}
		if (this.logData.isLogUpdateCoursesMethodInvalid) {
			this.updateCoursesInvalidPath = this.createFilePath(`update_courses_method_invalid_${Placeholder.DATE}`);
		}
		if (this.logData.isLogPurchaseCoursesMethodValid) {
			this.purchaseCoursesValidPath = this.createFilePath(`purchase_courses_method_valid_${Placeholder.DATE}`);
		}
		if (this.logData.isLogPurchaseCoursesMethodInvalid) {
			this.purchaseCoursesInvalidPath = this.createFilePath(`purchase_courses_method_invalid_${Placeholder.DATE}`);
		}
	}

	getNextDirectoryIndex() {
		const directories = fileUtils.getAllDirectories(this.baseSessionPath);
		if (!validationUtils.isExists(directories)) {
			return 1;
		}
		return Math.max(...directories.map(name => textUtils.getSplitNumber(name))) + 1;
	}

	async createSessionDirectory() {
		this.sessionDirectoryPath = pathUtils.getJoinPath({
			targetPath: this.baseSessionPath,
			targetName: `${this.getNextDirectoryIndex()}_${applicationService.applicationData.logDateTime}-${textUtils.getEmailLocalPart(accountService.accountData.email)}`
		});
		await fileUtils.createDirectory(this.sessionDirectoryPath);
	}

	createFilePath(fileName) {
		return pathUtils.getJoinPath({
			targetPath: this.sessionDirectoryPath ? this.sessionDirectoryPath : pathService.pathData.distPath,
			targetName: `${fileName.replace(Placeholder.DATE, applicationService.applicationData.logDateTime)}.txt`
		});
	}

	async logCourse(course) {
		if (!this.isLogs) {
			return;
		}
		let path = null;
		let isValid = null;
		switch (applicationService.applicationData.method) {
			case Method.CREATE_COURSES:
				isValid = course.status === CourseStatus.CREATE;
				path = isValid ? (this.logData.isLogCreateCoursesMethodValid ? this.createCoursesValidPath : null) :
					(this.logData.isLogCreateCoursesMethodInvalid ? this.createCoursesInvalidPath : null);
				break;
			case Method.UPDATE_COURSES:
				isValid = course.status === CourseStatus.CREATE;
				path = isValid ? (this.logData.isLogUpdateCoursesMethodValid ? this.updateCoursesValidPath : null) :
					(this.logData.isLogUpdateCoursesMethodInvalid ? this.updateCoursesInvalidPath : null);
				break;
			case Method.PURCHASE_COURSES:
				isValid = course.status === CourseStatus.PURCHASE;
				path = isValid ? (this.logData.isLogPurchaseCoursesMethodValid ? this.purchaseCoursesValidPath : null) :
					(this.logData.isLogPurchaseCoursesMethodInvalid ? this.purchaseCoursesInvalidPath : null);
				break;
		}
		if (!path) {
			return;
		}
		// Log the course.
		const message = this.createCourseTemplate({
			course: course,
			isLog: true
		});
		await fileUtils.appendFile({
			targetPath: path,
			message: message
		});
	}

	getCourseName(data) {
		const { courseURLCourseName, udemyURLCourseName, isLog } = data;
		let name = this.emptyValue;
		if (courseURLCourseName) {
			name = courseURLCourseName;
		}
		if (name === this.emptyValue && udemyURLCourseName) {
			name = udemyURLCourseName;
		}
		return isLog ? name : textUtils.cutText({ text: name, count: countLimitService.countLimitData.maximumCourseNameCharactersDisplayCount });
	}

	createCourseTemplate(data) {
		const { course, isLog } = data;
		const { id, postId, creationDateTime, pageNumber, indexPageNumber, publishDate, priceNumber, priceDisplay, courseURLCourseName,
			udemyURLCourseName, type, isFree, courseURL, udemyURL, couponKey, status, resultDateTime, resultDetails } = course;
		const time = timeUtils.getFullTime(resultDateTime);
		const displayCreationDateTime = timeUtils.getFullDateTemplate(creationDateTime);
		const displayPriceNumber = priceNumber ? priceNumber : this.emptyValue;
		const displayPriceDisplay = priceDisplay ? priceDisplay : this.emptyValue;
		const displayStatus = CourseStatusLog[status];
		const name = this.getCourseName({
			courseURLCourseName: courseURLCourseName,
			udemyURLCourseName: udemyURLCourseName,
			isLog: isLog
		});
		const displayCourseURL = textUtils.cutText({ text: courseURL, count: countLimitService.countLimitData.maximumURLCharactersDisplayCount });
		const displayUdemyURL = udemyURL ? textUtils.cutText({ text: udemyURL, count: countLimitService.countLimitData.maximumURLCharactersDisplayCount }) : this.emptyValue;
		const displayResultDetails = resultDetails.join('\n');
		const lines = [];
		lines.push(`Time: ${time} | Id: ${id} | Post Id: ${postId ? postId : this.emptyValue} | Creation Date Time: ${displayCreationDateTime}`);
		lines.push(`Publish Date: ${publishDate} | Price Number: ${displayPriceNumber} | Price Display: ${displayPriceDisplay} | Coupon Key: ${couponKey}`);
		lines.push(`Status: ${displayStatus} | Page Number: ${pageNumber} | Index Page Number: ${indexPageNumber} | Type: ${type} | Is Free: ${isFree}`);
		lines.push(`Name: ${name}`);
		lines.push(`Course URL: ${displayCourseURL}`);
		lines.push(`Udemy URL: ${displayUdemyURL}`);
		lines.push(`Result Details: ${displayResultDetails}`);
		lines.push(`${this.logSeperator}${isLog ? '\n' : ''}`);
		return lines.join('\n');
	}

	startLogProgress() {
		// Start the process for the first interval round.
		this.logInterval = setInterval(() => {
			// Update the current time of the process.
			applicationService.applicationData.time = timeUtils.getDifferenceTimeBetweenDates({
				startDateTime: applicationService.applicationData.startDateTime,
				endDateTime: new Date()
			});
			// Log the status console each interval round.
			this.logProgress();
		}, countLimitService.countLimitData.millisecondsIntervalCount);
	}

	getCurrentIndex(isPurchase) {
		const totalCount = isPurchase ? courseService.coursesData.coursesList.length : courseService.coursesData.totalCreateCoursesCount;
		const coursePosition = textUtils.getNumberOfNumber({ number1: courseService.coursesData.courseIndex, number2: totalCount });
		const coursePercentage = textUtils.calculatePercentageDisplay({ partialValue: courseService.coursesData.courseIndex, totalValue: totalCount });
		return `${coursePosition} (${coursePercentage})`;
	}

	logProgress() {
		const specificPageNumber = applicationService.applicationData.specificCoursesPageNumber ?
			applicationService.applicationData.specificCoursesPageNumber : this.emptyValue;
		const isKeyWordsFilter = validationUtils.isExists(applicationService.applicationData.keyWordsFilterList);
		const time = `${applicationService.applicationData.time} [${this.frames[this.i = ++this.i % this.frames.length]}]`;
		const totalPricePurchased = `₪${textUtils.getNumber2CharactersAfterDot(courseService.coursesData.totalPriceNumber)}`;
		let courseIndex = this.emptyValue;
		const totalSingleCount = textUtils.getNumberWithCommas(courseService.coursesData.totalSingleCount);
		const totalCourseListCount = textUtils.getNumberWithCommas(courseService.coursesData.totalCourseListCount);
		const coursesCount = `${textUtils.getNumberWithCommas(courseService.coursesData.coursesList.length)} (Single: ${totalSingleCount} / Course List: ${totalCourseListCount})`;
		switch (applicationService.applicationData.method) {
			case Method.CREATE_COURSES:
				courseIndex = courseService.coursesData.coursesList.length;
				break;
			case Method.UPDATE_COURSES:
				courseIndex = this.getCurrentIndex(false);
				break;
			case Method.PURCHASE_COURSES:
				courseIndex = this.getCurrentIndex(true);
				break;
		}
		let date = textUtils.getNumberWithCommas(applicationService.applicationData.coursesDatesValue.length);
		const purchaseCount = `${StatusIcon.V}  ${textUtils.getNumberWithCommas(courseService.coursesData.purchaseCount)}`;
		const failCount = `${StatusIcon.X}  ${textUtils.getNumberWithCommas(courseService.coursesData.failCount)}`;
		const coursesCurrentDate = applicationService.applicationData.coursesCurrentDate ? applicationService.applicationData.coursesCurrentDate : this.emptyValue;
		let creationDateTime = this.emptyValue;
		let id = this.emptyValue;
		let postId = this.emptyValue;
		let status = this.emptyValue;
		let publishDate = this.emptyValue;
		let pageNumber = this.emptyValue;
		let indexPageNumber = this.emptyValue;
		let isFree = this.emptyValue;
		let priceDisplay = this.emptyValue;
		let couponKey = this.emptyValue;
		let type = this.emptyValue;
		let name = this.emptyValue;
		let courseURL = this.emptyValue;
		let udemyURL = this.emptyValue;
		let resultDateTime = this.emptyValue;
		let resultDetails = this.emptyValue;
		if (courseService.coursesData.course) {
			creationDateTime = timeUtils.getFullDateTemplate(courseService.coursesData.course.creationDateTime);
			id = courseService.coursesData.course.id;
			postId = courseService.coursesData.course.postId ? courseService.coursesData.course.postId : this.emptyValue;
			status = CourseStatusLog[courseService.coursesData.course.status];
			publishDate = courseService.coursesData.course.publishDate;
			pageNumber = courseService.coursesData.course.pageNumber;
			indexPageNumber = courseService.coursesData.course.indexPageNumber;
			isFree = courseService.coursesData.course.isFree !== null ? courseService.coursesData.course.isFree : this.emptyValue;
			priceDisplay = courseService.coursesData.course.priceDisplay ? courseService.coursesData.course.priceDisplay : this.emptyValue;
			couponKey = courseService.coursesData.course.couponKey ? courseService.coursesData.course.couponKey : this.emptyValue;
			type = courseService.coursesData.course.type;
			name = this.getCourseName({
				courseURLCourseName: courseService.coursesData.course.courseURLCourseName,
				udemyURLCourseName: courseService.coursesData.course.udemyURLCourseName,
				isLog: false
			});
			courseURL = textUtils.cutText({ text: courseService.coursesData.course.courseURL, count: countLimitService.countLimitData.maximumURLCharactersDisplayCount });
			udemyURL = courseService.coursesData.course.udemyURL ? textUtils.cutText({
				text: courseService.coursesData.course.udemyURL,
				count: countLimitService.countLimitData.maximumURLCharactersDisplayCount
			}) : this.emptyValue;
			resultDateTime = courseService.coursesData.course.resultDateTime ?
				timeUtils.getFullDateTemplate(courseService.coursesData.course.resultDateTime) : this.emptyValue;
			resultDetails = validationUtils.isExists(courseService.coursesData.course.resultDetails) ?
				textUtils.cutText({
					text: courseService.coursesData.course.resultDetails.join(' '),
					count: countLimitService.countLimitData.maximumResultCharactersDisplayCount
				}) : this.emptyValue;
			date = `${textUtils.getNumberWithCommas(courseService.coursesData.course.indexDate + 1)}/${textUtils.getNumberWithCommas(applicationService.applicationData.coursesDatesValue.length)}`;
		}
		if (!this.isLogProgress) {
			return;
		}
		logUtils.logProgress({
			titlesList: ['SETTINGS', 'GENERAL1', 'GENERAL2', 'DATES', 'ACCOUNT', 'PROCESS1', 'PROCESS2',
				'PROCESS3', 'PROCESS4', 'DATA1', 'DATA2', 'DATA3', 'ERRORS', 'NAME', 'COURSE URL',
				'UDEMY URL', 'RESULT'],
			colorsTitlesList: [Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE,
			Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE,
			Color.BLUE, Color.BLUE, Color.BLUE],
			keysLists: [{
				'Environment': applicationService.applicationData.environment,
				'Method': applicationService.applicationData.method,
				'Specific Page Number': specificPageNumber
			}, {
				'Time': time,
				'Total Price Purchase': totalPricePurchased,
				'Course': courseIndex,
				'Courses Count': coursesCount
			}, {
				'Session Number': applicationService.applicationData.sessionNumber,
				'Is Key Words Filter': isKeyWordsFilter,
				'Pages Count': courseService.coursesData.totalPagesCount,
				'Status': applicationService.applicationData.status
			}, {
				'Type': applicationService.applicationData.coursesDatesType,
				'Value': applicationService.applicationData.coursesDatesDisplayValue,
				'Dates': date,
				'Current Date': coursesCurrentDate
			}, {
				'Email': accountService.accountData.email,
				'Password': accountService.accountData.asterixsPassword
			}, {
				'Purchase': purchaseCount,
				'Fail': failCount,
				'Filter': courseService.coursesData.filterCount,
				'Missing Field': courseService.coursesData.missingFieldCount,
				'Unexpected Field': courseService.coursesData.unexpectedFieldCount,
				'Duplicate': courseService.coursesData.duplicateCount
			}, {
				'Create Update Error': courseService.coursesData.createUpdateErrorCount,
				'Empty URL': courseService.coursesData.emptyURLCount,
				'Invalid URL': courseService.coursesData.invalidURLCount,
				'Not Exists': courseService.coursesData.notExistsCount,
				'Page Not Found': courseService.coursesData.pageNotFoundCount,
				'Limit Access': courseService.coursesData.limitAccessCount
			}, {
				'Suggestions List': courseService.coursesData.suggestionsListCount,
				'Private': courseService.coursesData.privateCount,
				'Already Purchase': courseService.coursesData.alreadyPurchaseCount,
				'Course Price Not Free': courseService.coursesData.coursePriceNotFreeCount
			}, {
				'Enroll Not Exists': courseService.coursesData.enrollNotExistsCount,
				'Checkout Price Not Exists': courseService.coursesData.checkoutPriceNotExistsCount,
				'Checkout Price Not Free': courseService.coursesData.checkoutPriceNotFreeCount,
				'Purchase Error': courseService.coursesData.purchaseErrorCount
			}, {
				'Creation': creationDateTime,
				'Id': id,
				'Post Id': postId,
				'Status': status
			}, {
				'Publish Date': publishDate,
				'Page Number': pageNumber,
				'Index Page Number': indexPageNumber
			}, {
				'Is Free': isFree,
				'Price Display': priceDisplay,
				'Coupon Key': couponKey,
				'Type': type
			}, {
				'Create Update Error In A Row': domService.createUpdateErrorsInARowCount,
				'Purchase Error In A Row': puppeteerService.purchaseErrorInARowCount
			}, {
				'#': name
			}, {
				'#': courseURL
			}, {
				'#': udemyURL
			}, {
				'Time': resultDateTime,
				'Result': resultDetails
			}],
			colorsLists: [
				[Color.YELLOW, Color.YELLOW, Color.YELLOW],
				[Color.YELLOW, Color.YELLOW, Color.YELLOW, Color.YELLOW],
				[Color.YELLOW, Color.YELLOW, Color.YELLOW, Color.YELLOW],
				[Color.YELLOW, Color.YELLOW, Color.YELLOW, Color.YELLOW],
				[Color.YELLOW, Color.YELLOW],
				[Color.GREEN, Color.RED, Color.CYAN, Color.CYAN, Color.CYAN, Color.CYAN],
				[Color.CYAN, Color.CYAN, Color.CYAN, Color.CYAN, Color.CYAN, Color.CYAN],
				[Color.CYAN, Color.CYAN, Color.CYAN, Color.CYAN],
				[Color.CYAN, Color.CYAN, Color.CYAN, Color.CYAN],
				[Color.YELLOW, Color.YELLOW, Color.YELLOW, Color.YELLOW],
				[Color.YELLOW, Color.YELLOW, Color.YELLOW],
				[Color.YELLOW, Color.YELLOW, Color.YELLOW, Color.YELLOW],
				[Color.RED, Color.RED],
				[], [], [],
				[Color.CYAN, Color.CYAN]
			],
			nonNumericKeys: { 'Id': 'Id', 'Post Id': 'Post Id' },
			statusColor: Color.CYAN
		});
	}

	close() {
		if (this.logInterval) {
			clearInterval(this.logInterval);
		}
	}

	createLineTemplate(title, value) {
		return textUtils.addBreakLine(`${logUtils.logColor(`${title}:`, Color.MAGENTA)} ${value}`);
	}

	createConfirmSettingsTemplate(settings) {
		const parameters = ['MODE', 'IS_PRODUCTION_ENVIRONMENT', 'COURSES_BASE_URL', 'UDEMY_BASE_URL', 'SINGLE_COURSE_INIT',
			'COURSES_DATES_VALUE', 'SPECIFIC_COURSES_PAGE_NUMBER', 'KEY_WORDS_FILTER_LIST', 'IS_CREATE_COURSES_METHOD_ACTIVE',
			'IS_UPDATE_COURSES_METHOD_ACTIVE', 'IS_PURCHASE_COURSES_METHOD_ACTIVE', 'IS_LOG_CREATE_COURSES_METHOD_VALID',
			'IS_LOG_CREATE_COURSES_METHOD_INVALID', 'IS_LOG_UPDATE_COURSES_METHOD_VALID', 'IS_LOG_UPDATE_COURSES_METHOD_INVALID',
			'IS_LOG_PURCHASE_COURSES_METHOD_VALID', 'IS_LOG_PURCHASE_COURSES_METHOD_INVALID', 'IS_LOG_PURCHASE_COURSES_METHOD_ONLY',
			'MAXIMUM_COURSES_PURCHASE_COUNT', 'MAXIMUM_PAGES_NUMBER'];
		let settingsText = this.createLineTemplate('EMAIL', accountService.accountData.email);
		settingsText += Object.keys(settings).filter(s => parameters.indexOf(s) > -1)
			.map(k => this.createLineTemplate(k, settings[k])).join('');
		settingsText = textUtils.removeLastCharacters({
			value: settingsText,
			charactersCount: 1
		});
		return `${textUtils.setLogStatus('IMPORTANT SETTINGS')}
${settingsText}
========================
OK to run? (y = yes)`;
	}
}

module.exports = new LogService(); */