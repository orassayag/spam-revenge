const settings = require('../../settings/settings');
const { Mode, ScriptType } = require('../../core/enums/files/system.enum');
const { fileUtils, pathUtils, validationUtils } = require('../../utils');
const globalUtils = require('../../utils/files/global.utils');

class InitiateService {

	constructor() {
		this.scriptType = null;
	}

	initiate(scriptType) {
		// First, setup handle errors and promises.
		this.setup();
		// Validate the script type.
		this.scriptType = scriptType;
		this.validateScriptType();
		// The second important thing to to it to validate all the parameters of the settings.js file.
		this.validateSettings();
		// The next thing is to calculate paths and inject back to the settings.js file.
		this.calculateSettings();
		// Make sure that the dist directory exists. If not, create it.
		this.validateDirectories();
		// Validate that certain directories exists, and if not, create them.
		this.createDirectories();
	}

	setup() {
		// Handle any uncaughtException error.
		process.on('uncaughtException', (error) => {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			console.log(error);
			process.exit(0);
		});
		// Handle any unhandledRejection promise error.
		process.on('unhandledRejection', (reason, promise) => {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			console.log(reason);
			console.log(promise);
			process.exit(0);
		});
	}

	validateScriptType() {
		if (!this.scriptType || !validationUtils.isValidEnum({
			enum: ScriptType,
			value: this.scriptType
		})) {
			throw new Error('Invalid or no ScriptType parameter was found (1000014)');
		}
	}

	validateSettings() {
		// Validate the settings object existence.
		if (!settings) {
			throw new Error('Invalid or no settings object was found (1000015)');
		}
		this.validatePositiveNumbers();
		this.validateStrings();
		this.validateBooleans();
		this.validateArrays();
		this.validateEnums();
		this.validateSpecial();
	}

	calculateSettings() {
		const { OUTER_APPLICATION_PATH, INNER_APPLICATION_PATH, APPLICATION_PATH, BACKUPS_PATH,
			DIST_PATH, NODE_MODULES_PATH, PACKAGE_JSON_PATH, PACKAGE_LOCK_JSON_PATH } = settings;
		// ===DYNAMIC PATH=== //
		settings.APPLICATION_PATH = pathUtils.getJoinPath({ targetPath: OUTER_APPLICATION_PATH, targetName: APPLICATION_PATH });
		if (this.scriptType === ScriptType.BACKUP) {
			settings.BACKUPS_PATH = pathUtils.getJoinPath({ targetPath: OUTER_APPLICATION_PATH, targetName: BACKUPS_PATH });
		}
		settings.DIST_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: DIST_PATH });
		settings.NODE_MODULES_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: NODE_MODULES_PATH });
		settings.PACKAGE_JSON_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: PACKAGE_JSON_PATH });
		settings.PACKAGE_LOCK_JSON_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: PACKAGE_LOCK_JSON_PATH });
	}

	validatePositiveNumbers() {
		[
			// ===COUNT & LIMIT=== //
			'MAXIMUM_COURSES_PURCHASE_COUNT', 'MILLISECONDS_TIMEOUT_SOURCE_REQUEST_COUNT', 'MAXIMUM_PAGES_NUMBER', 'MAXIMUM_SESSIONS_COUNT',
			'MILLISECONDS_INTERVAL_COUNT', 'MILLISECONDS_TIMEOUT_BETWEEN_COURSES_CREATE', 'MILLISECONDS_TIMEOUT_BETWEEN_COURSES_MAIN_PAGES',
			'MILLISECONDS_TIMEOUT_BETWEEN_COURSES_UPDATE', 'MAXIMUM_COURSE_NAME_CHARACTERS_DISPLAY_COUNT', 'MAXIMUM_URL_CHARACTERS_DISPLAY_COUNT',
			'MAXIMUM_RESULT_CHARACTERS_DISPLAY_COUNT', 'MILLISECONDS_TIMEOUT_UDEMY_ACTIONS', 'MAXIMUM_UDEMY_LOGIN_ATTEMPTS_COUNT',
			'MILLISECONDS_TIMEOUT_BETWEEN_COURSES_PURCHASE', 'MILLISECONDS_TIMEOUT_UDEMY_PAGE_LOAD', 'MAXIMUM_CREATE_UPDATE_ERROR_IN_A_ROW_COUNT',
			'MAXIMUM_PURCHASE_ERROR_IN_A_ROW_COUNT', 'MILLISECONDS_TIMEOUT_EXIT_APPLICATION', 'MAXIMUM_URL_VALIDATION_COUNT',
			'MILLISECONDS_TIMEOUT_URL_VALIDATION', 'MAXIMUM_COURSES_DATES_DISPLAY_COUNT',
			// ===BACKUP=== //
			'MILLISECONDS_DELAY_VERIFY_BACKUP_COUNT', 'BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isPositiveNumber(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Excpected a number but received: ${value} (1000016)`);
			}
		});
	}

	validateStrings() {
		const keys = this.scriptType === ScriptType.BACKUP ? ['BACKUPS_PATH'] : [];
		[
			...keys,
			// ===GENERAL=== //
			'MODE', 'COURSES_BASE_URL', 'UDEMY_BASE_URL', 'SINGLE_COURSE_INIT',
			// ===ROOT PATH=== //
			'APPLICATION_NAME', 'OUTER_APPLICATION_PATH', 'INNER_APPLICATION_PATH', 'ACCOUNT_FILE_PATH',
			// ===DYNAMIC PATH=== //
			'APPLICATION_PATH', 'DIST_PATH', 'NODE_MODULES_PATH', 'PACKAGE_JSON_PATH',
			'PACKAGE_LOCK_JSON_PATH'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isExists(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Excpected a string but received: ${value} (1000017)`);
			}
		});
	}

	validateBooleans() {
		[
			// ===FLAG=== //
			'IS_PRODUCTION_ENVIRONMENT', 'IS_CREATE_COURSES_METHOD_ACTIVE', 'IS_UPDATE_COURSES_METHOD_ACTIVE',
			'IS_PURCHASE_COURSES_METHOD_ACTIVE',
			// ===LOG=== //
			'IS_LOG_CREATE_COURSES_METHOD_VALID', 'IS_LOG_CREATE_COURSES_METHOD_INVALID', 'IS_LOG_UPDATE_COURSES_METHOD_VALID',
			'IS_LOG_UPDATE_COURSES_METHOD_INVALID', 'IS_LOG_PURCHASE_COURSES_METHOD_VALID', 'IS_LOG_PURCHASE_COURSES_METHOD_INVALID'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidBoolean(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Excpected a boolean but received: ${value} (1000018)`);
			}
		});
	}

	validateArrays() {
		[
			// ===GENERAL=== //
			'KEY_WORDS_FILTER_LIST',
			// ===BACKUP=== //
			'IGNORE_DIRECTORIES', 'IGNORE_FILES', 'INCLUDE_FILES'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidArray(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Excpected a array but received: ${value} (1000019)`);
			}
		});
	}

	validateEnums() {
		const { MODE } = settings;
		// ===GENERAL=== //
		if (!validationUtils.isValidEnum({
			enum: Mode,
			value: MODE
		})) {
			throw new Error('Invalid or no MODE parameter was found (1000020)');
		}
	}

	validateSpecial() {
		[
			// ===GENERAL=== //
			'COURSES_BASE_URL', 'UDEMY_BASE_URL'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidURL(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Excpected a URL but received: ${value} (1000021)`);
			}
		});
		const { COURSES_DATES_VALUE } = settings;
		if (!COURSES_DATES_VALUE) {
			throw new Error(`Missing COURSES_DATES_VALUE parameter: ${COURSES_DATES_VALUE} (1000022)`);
		}
	}

	validateDirectories() {
		const keys = this.scriptType === ScriptType.BACKUP ? ['BACKUPS_PATH'] : [];
		[
			...keys,
			// ===ROOT PATH=== //
			'OUTER_APPLICATION_PATH', 'INNER_APPLICATION_PATH',
			// ===DYNAMIC PATH=== //
			'APPLICATION_PATH', 'PACKAGE_JSON_PATH'
		].map(key => {
			const value = settings[key];
			// Verify that the dist and the sources paths exists.
			globalUtils.isPathExistsError(value);
			// Verify that the dist and the sources paths accessible.
			globalUtils.isPathAccessible(value);
		});
		[
			...keys,
			// ===ROOT PATH=== //
			'OUTER_APPLICATION_PATH', 'INNER_APPLICATION_PATH'
		].map(key => {
			const value = settings[key];
			// Verify that the paths are of directory and not a file.
			if (!fileUtils.isDirectoryPath(value)) {
				throw new Error(`The parameter path ${key} marked as directory but it's a path of a file: ${value} (1000023)`);
			}
		});
	}

	createDirectories() {
		[
			// ===DYNAMIC PATH=== //
			'DIST_PATH', 'NODE_MODULES_PATH'
		].map(key => {
			const value = settings[key];
			// Make sure that the dist directory exists, if not, create it.
			fileUtils.createDirectory(value);
		});
	}
}

module.exports = new InitiateService();