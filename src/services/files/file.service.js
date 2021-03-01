const { fileUtils, pathUtils, textUtils } = require('../../utils');

class FileService {

    constructor() { }

    async getFileData(data) {
        const { environment, path, parameterName, fileExtension } = data;
        const filePath = `${path}account-${textUtils.toLowerCase(environment)}.json`;
        if (!await fileUtils.isPathExists(filePath)) {
            throw new Error(`Invalid or no ${parameterName} parameter was found: Excpected a number but received: ${filePath} (1000010)`);
        }
        if (!fileUtils.isFilePath(filePath)) {
            throw new Error(`The parameter path ${parameterName} marked as file but it's a path of a directory: ${filePath} (1000011)`);
        }
        const extension = pathUtils.getExtension(filePath);
        if (extension !== fileExtension) {
            throw new Error(`The parameter path ${parameterName} must be a ${fileExtension} file but it's: ${extension} file (1000012)`);
        }
        const fileData = await fileUtils.read(filePath);
        const jsonData = JSON.parse(fileData);
        if (jsonData.length <= 0) {
            throw new Error(`No data exists in the file: ${filePath} (1000013)`);
        }
        return jsonData;
    }
}

module.exports = new FileService();