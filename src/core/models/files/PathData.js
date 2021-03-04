class PathData {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { SUBSCRIBE_LIST_FILE_PATH, DIST_PATH } = settings;
		this.subscribeListFilePath = SUBSCRIBE_LIST_FILE_PATH;
		this.distPath = DIST_PATH;
	}
}

module.exports = PathData;