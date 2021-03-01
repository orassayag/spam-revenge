class PathData {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { DIST_PATH } = settings;
		this.distPath = DIST_PATH;
	}
}

module.exports = PathData;