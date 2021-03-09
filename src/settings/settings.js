const { Mode } = require('../core/enums');
const { pathUtils } = require('../utils');

const settings = {
    // ===GENERAL=== //
    // Determine the mode of the application. STANDARD/SILENT.
    MODE: Mode.STANDARD,
    // Determine the target email address(es) to subscribe to spam services.
    EMAIL_ADDRESSES: ['test@test.com', 'test@test.com', 'test2@test.com'],
    // Determine the URL to check the local PC public IP address.
    PUBLIC_IP_ADDRESS_URL: 'https://api.ipify.org',
    //PUBLIC_IP_ADDRESS_URL: 'https://ipinfo.io/json',

    // ===FLAG=== //
    // Determine if to simulate subscriptions (with delay) and proxy connection (=DEVELOPMENT)
    // or to subscribe the target email addresses for REAL (PRODUCTION).
    IS_PRODUCTION_ENVIRONMENT: true,
    // Determine if to puppeeter should connect via local connection (=false) or random proxy connection (=true).
    IS_PROXY_CONNECTION_ACTIVE: true,
    // Determine if to take random subscribes if exceeded (=true), or take them by the original order (=false).
    IS_RANDOM_SUBSCRIBES_EXCEEDED: false,

    // ===LOG=== //
    // Determine if to log the valid subscriptions.
    IS_LOG_SUBSCRIBE_VALID: true,
    // Determine if to log the invalid subscriptions.
    IS_LOG_SUBSCRIBE_INVALID: true,

    // ===COUNT & LIMIT=== //
    // Determine how many email addresses to subscribe to all the subscribes. Will take the first if exceeded.
    MAXIMUM_EMAIL_ADDRESSSES_COUNT: 10,
    // Determine how many subscribes to subscribe each email address. Will take the first if exceeded.
    MAXIMUM_SUBSRIBES_COUNT: 2000,
    // Determine the milliseconds count timeout to wait before exit the application.
    MILLISECONDS_TIMEOUT_EXIT_APPLICATION: 1000,
    // Determine the retries count to validate the internet connection.
    MAXIMUM_VALIDATE_INTERNET_CONNECTION_RETRIES_COUNT: 5,
    // Determine the retries count to search for valid proxy.
    MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT: 10,

    // ===ROOT PATH=== //
    // Determine the application name used for some of the calculated paths.
    APPLICATION_NAME: 'spam-revenge',
    // Determine the path for the outer application, where other directories located, such as backups, sources, etc...
    // (Working example: 'C:\\Or\\Web\\spam-revenge\\').
    OUTER_APPLICATION_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../../'
    }),
    // Determine the inner application path where all the source of the application is located.
    // (Working example: 'C:\\Or\\Web\\spam-revenge\\spam-revenge\\').
    INNER_APPLICATION_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../'
    }),
    // Determine the path of the JSON file from which the subscribe list URLs will be fetched. Must be a JSON file.
    SUBSCRIBE_LIST_FILE_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../sources/subscribe-list.json'
    }),

    // ===DYNAMIC PATH=== //
    // All the these paths will be calculated during runtime in the initiate service.
    // DON'T REMOVE THE KEYS, THEY WILL BE CALCULATED TO PATHS DURING RUNTIME.
    // Determine the application path where all the source of the application is located.
    // (Working example: 'C:\\Or\\Web\\spam-revenge\\spam-revenge').
    APPLICATION_PATH: 'spam-revenge',
    // Determine the backups directory which all the local backup will be created to.
    // (Working example: 'C:\\Or\\Web\\spam-revenge\\backups').
    BACKUPS_PATH: 'backups',
    // Determine the dist directory path which there, all the outcome of the crawling will be created.
    // (Working example: 'C:\\Or\\Web\\spam-revenge\\spam-revenge\\dist').
    DIST_PATH: 'dist',
    // Determine the directory path of the node_modules.
    // (Working example: 'C:\\Or\\Web\\spam-revenge\\spam-revenge\\node_modules').
    NODE_MODULES_PATH: 'node_modules',
    // Determine the directory of the package.json.
    // (Working example: 'C:\\Or\\Web\\spam-revenge\\spam-revenge\\package.json').
    PACKAGE_JSON_PATH: 'package.json',
    // Determine the path of the package-lock.json.
    // (Working example: 'C:\\Or\\Web\\spam-revenge\\spam-revenge\\package-lock.json').
    PACKAGE_LOCK_JSON_PATH: 'package-lock.json',

    // ===BACKUP=== //
    // Determine the directories to ignore when an backup copy is taking place.
    // For example: 'dist'.
    IGNORE_DIRECTORIES: ['.git', 'dist', 'node_modules', 'sources'],
    // Determine the files to ignore when the back copy is taking place.
    // For example: 'back_sources_tasks.txt'.
    IGNORE_FILES: [],
    // Determine the files to force include when the back copy is taking place.
    // For example: '.gitignore'.
    INCLUDE_FILES: ['.gitignore'],
    // Determine the period of time in milliseconds to
    // check that files were created / moved to the target path.
    MILLISECONDS_DELAY_VERIFY_BACKUP_COUNT: 1000,
    // Determine the number of time in loop to check for version of a backup.
    // For example, if a backup name "test-test-test-1" exists, it will check for "test-test-test-2",
    // and so on, until the current maximum number.
    BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT: 50,

    // ===VALIDATION=== //
    // Determine the link address to test the internet connection.
    VALIDATION_CONNECTION_LINK: 'google.com'
};

module.exports = settings;