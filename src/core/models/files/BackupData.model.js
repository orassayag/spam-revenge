const BackupDirectoryModel = require('./BackupDirectory.model');

class BackupDataModel {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { APPLICATION_NAME, BACKUPS_PATH, APPLICATION_PATH, MILLISECONDS_DELAY_VERIFY_BACKUP_COUNT,
			BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT } = settings;
		this.millisecondsDelayVerifyBackupCount = MILLISECONDS_DELAY_VERIFY_BACKUP_COUNT;
		this.backupMaximumDirectoryVersionsCount = BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT;
		this.backupsPath = BACKUPS_PATH;
		this.applicationName = APPLICATION_NAME;
		this.sourceFullPath = APPLICATION_PATH;
		this.targetFullPath = null;
		this.targetBackupName = null;
		this.backupDirectoryModel = new BackupDirectoryModel(settings);
	}
}

module.exports = BackupDataModel;