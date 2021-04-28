const { LogDataModel } = require('../../core/models');
const { ModeEnum, PlaceholderEnum } = require('../../core/enums');
const applicationService = require('./application.service');
const pathService = require('./path.service');
const { fileUtils, pathUtils, textUtils, validationUtils } = require('../../utils');

class LogService {

	constructor() {
		this.isLogProgress = null;
		this.logDataModel = null;
		this.logInterval = null;
		// ===PATH=== //
		this.baseSessionPath = null;
		this.sessionDirectoryPath = null;
		this.subscribeValidPath = null;
		this.subscribeInvalidPath = null;
		this.i = 0;
		this.frames = ['-', '\\', '|', '/'];
		this.emptyValue = '##';
		this.logSeparator = '==========';
		this.isLogs = true;
	}

	initiate(settings) {
		this.logDataModel = new LogDataModel(settings);
		// Check if any logs active.
		this.isLogs = applicationService.applicationDataModel.mode === ModeEnum.STANDARD &&
			(this.logDataModel.isLogSubscribeValidPath || this.logDataModel.isLogSubscribeInvalidPath);
		this.initiateDirectories();
		this.isLogProgress = applicationService.applicationDataModel.mode === ModeEnum.STANDARD;
	}

	initiateDirectories() {
		if (!this.isLogs) {
			return;
		}
		// ===PATH=== //
		this.baseSessionPath = pathService.pathDataModel.distPath;
		this.createSessionDirectory();
		if (this.logDataModel.isLogSubscribeValidPath) {
			this.subscribeValidPath = this.createFilePath(`subscribe_valid_${PlaceholderEnum.DATE}`);
		}
		if (this.logDataModel.isLogSubscribeInvalidPath) {
			this.subscribeInvalidPath = this.createFilePath(`subscribe_invalid_${PlaceholderEnum.DATE}`);
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
			targetName: `${this.getNextDirectoryIndex()}_${applicationService.applicationDataModel.logDateTime}`
		});
		fileUtils.createDirectory(this.sessionDirectoryPath);
	}

	createFilePath(fileName) {
		return pathUtils.getJoinPath({
			targetPath: this.sessionDirectoryPath ? this.sessionDirectoryPath : pathService.pathDataModel.distPath,
			targetName: `${fileName.replace(PlaceholderEnum.DATE, applicationService.applicationDataModel.logDateTime)}.txt`
		});
	}

	close() {
		if (this.logInterval) {
			clearInterval(this.logInterval);
		}
	}
}

module.exports = new LogService();