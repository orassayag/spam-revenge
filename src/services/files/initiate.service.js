const settings = require('../../settings/settings');
const { Mode, ScriptType } = require('../../core/enums');
const { fileUtils, pathUtils, validationUtils } = require('../../utils');
const globalUtils = require('../../utils/files/global.utils');

class InitiateService {

	constructor() {
		this.scriptType = null;
	}

	initiate(scriptType) {
		// First, setup handles errors and promises.
		this.setup();
		// Validate the script type.
		this.scriptType = scriptType;
		this.validateScriptType();
		// The second important thing to do is to validate all the parameters of the settings.js file.
		this.validateSettings();
		// The next thing is to calculate paths and inject back to the settings.js file.
		this.calculateSettings();
		// Make sure that the dist directory exists. If not, create it.
		this.validateDirectories();
		// Validate that certain directories exist, and if not, create them.
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
			'MAXIMUM_EMAIL_ADDRESSSES_COUNT', 'MAXIMUM_SUBSRIBES_COUNT', 'MILLISECONDS_TIMEOUT_EXIT_APPLICATION',
			'MAXIMUM_VALIDATE_INTERNET_CONNECTION_RETRIES_COUNT', 'MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT',
			// ===BACKUP=== //
			'MILLISECONDS_DELAY_VERIFY_BACKUP_COUNT', 'BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isPositiveNumber(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a number but received: ${value} (1000016)`);
			}
		});
	}

	validateStrings() {
		const keys = this.scriptType === ScriptType.BACKUP ? ['BACKUPS_PATH'] : [];
		[
			...keys,
			// ===GENERAL=== //
			// ===ROOT PATH=== //
			'APPLICATION_NAME', 'OUTER_APPLICATION_PATH', 'INNER_APPLICATION_PATH', 'SUBSCRIBE_LIST_FILE_PATH',
			// ===DYNAMIC PATH=== //
			'APPLICATION_PATH', 'DIST_PATH', 'NODE_MODULES_PATH', 'PACKAGE_JSON_PATH', 'PACKAGE_LOCK_JSON_PATH'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isExists(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a string but received: ${value} (1000017)`);
			}
		});
	}

	validateBooleans() {
		[
			// ===FLAG=== //
			'IS_PRODUCTION_ENVIRONMENT', 'IS_PROXY_CONNECTION_ACTIVE',
			// ===LOG=== //
			'IS_LOG_SUBSCRIBE_VALID', 'IS_LOG_SUBSCRIBE_INVALID'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidBoolean(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a boolean but received: ${value} (1000018)`);
			}
		});
	}

	validateArrays() {
		[
			// ===GENERAL=== //
			'EMAIL_ADDRESSES',
			// ===BACKUP=== //
			'IGNORE_DIRECTORIES', 'IGNORE_FILES', 'INCLUDE_FILES'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidArray(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a array but received: ${value} (1000019)`);
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
			'PUBLIC_IP_ADDRESS_URL',
			// ===VALIDATION=== //
			'VALIDATION_CONNECTION_LINK'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidURL(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a URL but received: ${value} (1000019)`);
			}
		});
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
			// Verify that the dist and the source paths are accessible.
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
/* 		const { PUBLIC_IP_URL, ALIDATION_CONNECTION_LINK } = settings;
		// ===VALIDATION=== //
		if (!validationUtils.isValidURL(VALIDATION_CONNECTION_LINK)) {
			throw new Error('Invalid or no VALIDATION_CONNECTION_LINK parameter was found (1000030)');
		} */
/* 		[
			// ===GENERAL=== //
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidURL(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a URL but received: ${value} (1000021)`);
			}
		}); */
/**/
/* 	    // ===GENERAL=== //
// Determine the mode of the application. STANDARD/SILENT.
MODE: Mode.STANDARD,
// Determine the target email address(es) to subscribe to spam services.
TARGET_EMAIL_ADDRESSES: [],

// ===FLAG=== //
// Determine if to simulate subscriptions and proxy connection (=DEVELOPMENT)
// or to subscribe to the target email addresses for REAL (PRODUCTION).
IS_PRODUCTION_ENVIRONMENT: true,
// Determine if to puppeeter should connect via local connection (=false) or random proxy connection (=true).
IS_PROXY_CONNECTION_ACTIVE: true,

// ===LOG=== //
// Determine if to log the valid subscriptions.
IS_LOG_SUBSCRIBE_VALID: true,
// Determine if to log the invalid subscriptions.
IS_LOG_SUBSCRIBE_INVALID: true, */

/*

/* 'DIST_PATH',  */
/* 'DIST_PATH',  */
/* DIST_PATH,  */
/* 		settings.DIST_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: DIST_PATH }); */