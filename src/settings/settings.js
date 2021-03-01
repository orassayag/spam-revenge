const { Mode } = require('../core/enums');
const { pathUtils } = require('../utils');

const settings = {
    // ===GENERAL=== //
    // Determine the mode of the application. STANDARD/SILENT.
    MODE: Mode.STANDARD,

    // ===FLAG=== //

    // ===LOG=== //

    // ===COUNT & LIMIT=== //

    // ===ROOT PATH=== //
    // Determine the application name used for some of the calculated paths.
    APPLICATION_NAME: 'spam-revenge',
    // Determine the path for the outer application, where other directories located, such as backups, sources, etc...
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\').
    OUTER_APPLICATION_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../../'
    }),
    // Determine the inner application path where all the source of the application is located.
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\udemy-courses\\').
    INNER_APPLICATION_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../'
    }),
    // Determine the path of the JSON file from which the Udemy account will be fetched. Must be a JSON file.
    ACCOUNT_FILE_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../../../../../Accounts/Spam-Revenge/spam-list.json'
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
    BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT: 50
};

module.exports = settings;