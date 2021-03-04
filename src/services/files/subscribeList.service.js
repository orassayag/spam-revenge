const pathService = require('./path.service');
const { fileUtils, pathUtils } = require('../../utils');

class SubscribeListService {

    constructor() { }

    async setSubscribeList() {
        const jsonData = await this.getJsonFileData({
            filePath: pathService.pathData.subscribeListFilePath,
            parameterName: 'subscribeListFilePath'
        });
        for(let i = 0; i < jsonData.length; i++)
        {

        }
    }

    async getJsonFileData(data) {
        const { filePath, parameterName } = data;
        if (!await fileUtils.isPathExists(filePath)) {
            throw new Error(`Invalid or no ${parameterName} parameter was found: Excpected a number but received: ${filePath} (1000010)`);
        }
        if (!fileUtils.isFilePath(filePath)) {
            throw new Error(`The parameter path ${parameterName} marked as file but it's a path of a directory: ${filePath} (1000011)`);
        }
        const extension = pathUtils.getExtension(filePath);
        if (extension !== '.json') {
            throw new Error(`The parameter path ${parameterName} must be a .json file but it's: ${extension} file (1000012)`);
        }
        const fileData = await fileUtils.read(filePath);
        const jsonData = JSON.parse(fileData);
        if (jsonData.length <= 0) {
            throw new Error(`No data exists in the file: ${filePath} (1000013)`);
        }
        return jsonData;
    }
}

module.exports = new SubscribeListService();
/*         if (!js
        ) */
/*         console.log(jsonData); */
/*         const filePath = pathService.pathData.subscribeListFilePath; */
/* const { AccountData } = require('../../core/models');
const fileService = require('./file.service');
const { applicationUtils, textUtils, validationUtils } = require('../../utils');

class AccountService {

    constructor() {
        this.accountData = null;
    }

    async initiate(settings) {
        this.accountData = new AccountData(settings);
        const account = await fileService.getFileData({
            environment: applicationUtils.getApplicationEnvironment(settings.IS_PRODUCTION_ENVIRONMENT),
            path: this.accountData.accountFilePath,
            parameterName: 'accountFilePath',
            fileExtension: '.json'
        });
        const { email, password } = account[0];
        const validationResult = this.validateAccount({
            email: email,
            password: password
        });
        this.accountData.email = validationResult.email;
        this.accountData.password = validationResult.password;
        this.accountData.asterixsPassword = textUtils.getAsteriskCharactersString(validationResult.password.length);
    }

    validateAccount(data) {
        let { email, password } = data;
        if (!email) {
            throw new Error('Missing email account (1000003)');
        }
        if (!validationUtils.validateEmailAddress(textUtils.toLowerCase(email))) {
            throw new Error('Invalid email account (1000004)');
        }
        if (!password) {
            throw new Error('Missing password account (1000005)');
        }
        email = email.trim();
        password = password.trim();
        return {
            email: email,
            password: password
        };
    }
}

module.exports = new AccountService(); */