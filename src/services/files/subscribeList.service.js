const { SubscribeData, SubscribesData } = require('../../core/models');
const { SubscribeStatus } = require('../../core/enums');
const pathService = require('./path.service');
const { fileUtils, pathUtils, textUtils, validationUtils } = require('../../utils');

class SubscribeListService {

    constructor() {
        this.subscribesData = new SubscribesData();
        this.lastSubscribeId = 1;
    }

    async setSubscribeList() {
        const jsonData = await this.getJsonFileData({
            filePath: pathService.pathData.subscribeListFilePath,
            parameterName: 'subscribeListFilePath'
        });
        for (let i = 0; i < jsonData.length; i++) {
            createSubscribe(jsonData[i], i);
        }
        // Validate the subscribes.
        this.finalizeCreateSubscribes();
    }

    createSubscribe(subscribeData, index) {
        let subscribe = new SubscribeData(this.lastCourseId, index);
        this.lastCourseId++;
        subscribe = this.validateSubscribe({
            subscribe: subscribe,
            subscribeData: subscribeData
        });
        this.subscribesData.subscribeList.push(subscribe);
        this.subscribesData.subscribe = subscribe;
    }

    /*     this.id = id;
    this.indexId = indexId;
    this.creationDateTime = new Date();
    this.urlAddress = null;
    this.urlAddressCompare = null;
    this.textBoxFieldName = null;
    this.textBoxFieldValue = null;
    this.buttonFieldName = null;
    this.buttonFieldValue = null;
    this.status = SubscribeStatus.CREATE;
    this.resultDateTime = null;
    this.resultDetails = []; */

    /*     [
            {
                "urlAddress": "https://www.test.com",
                "textBoxFieldName": "name",
                "textBoxFieldValue": "email",
                "buttonFieldName": "name",
                "buttonFieldValue": "submit"
            }
        ] */

    /*     const SubscribeStatus = enumUtils.createEnum([
            ['CREATE', 'create'],
            ['SUBSCRIBE', 'subscribe'],
            ['FAIL', 'fail'],
            ['NO_DATA', 'noData'],
            ['MISSING_URL', 'missingURL'],
            ['INVALID_URL', 'invalidURL'],
            ['MISSING_TEXTBOX_FIELD', 'missingTextBoxField'],
            ['MISSING_TEXTBOX_VALUE', 'missingTextBoxValue'],
            ['MISSING_BUTTON_FIELD', 'missingButtonField'],
            ['MISSING_BUTTON_VALUE', 'missingButtonValue'],
            ['MISSING_FIELD', 'missingField'],
            ['UNEXPECTED_FIELD', 'unexpectedField'],
            ['URL_NOT_FOUND', 'urlNotFound'],
            ['TEXTBOX_NOT_FOUND', 'textBoxNotFound'],
            ['BUTTON_NOT_FOUND', 'buttonNotFound'],
            ['DUPLICATE', 'duplicate']
        ]); */

    validateSubscribe(data) {
        const { subscribe, subscribeData } = data;
        if (!subscribeData) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.NO_DATA,
                details: 'This subscribe repeats multiple times in this session and should be subscribed.'
            });
        }
        // Validate URL field.
        if (!subscribe.urlAddress) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.MISSING_URL,
                details: 'Empty or no urlAddress field was found.'
            });
        }
        if (!validationUtils.isValidEmailAddress(subscribe.urlAddress)) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.INVALID_URL,
                details: 'Invalid urlAddress field was found.'
            });
        }
        subscribe.urlAddress = subscribe.urlAddress.trim();
        subscribe.urlAddressCompare = textUtils.toLowerCaseTrim(subscribe.urlAddress);
        // Validate TextBox fields.
        if ()

            return subscribe;
    }

    finalizeCreateSubscribes() {
        // Validate any subscribes exists to subscribe.
        if (this.subscribesData.subscribeList.length <= 0) {
            throw new Error('No subscribes exists to subscribe (1000034)');
        }
        for (let i = 0; i < this.subscribesData.subscribeList.length; i++) {
            const subscribe = this.subscribesData.subscribeList[i];
            // Validate all fields.
            let scanFieldsResult = this.validateFields(subscribe);
            if (scanFieldsResult) {
                this.subscribesData.subscribeList[i] = this.updateSubscribeStatus({
                    subscribe: subscribe,
                    status: scanFieldsResult.status,
                    details: scanFieldsResult.details
                });
            }
            // Compare subscribes and detect duplicates.
            this.compareSubscribers(subscribe);
        }
        // Validate that there are any subscribes to subscribe.
        if (this.subscribesData.subscribeList.map(s => s.status === SubscribeStatus.CREATE).length <= 0) {
            throw new Error('No valid subscribes found to subscribe (1000034)');
        }
    }

    validateFields(subscribe) {
        // Validate all expected fields.
        let scanFieldsResult = this.scanFields({
            subscribe: subscribe,
            keysList: ['id', 'indexId', 'creationDateTime', 'urlAddress', 'urlAddressCompare', 'textBoxFieldName', 'textBoxFieldValue',
                'buttonFieldName', 'buttonFieldValue', 'status'],
            isFilledExpected: true
        });
        if (!scanFieldsResult) {
            return scanFieldsResult;
        }
        // Validate all unexpected fields.
        scanFieldsResult = this.scanFields({
            subscribe: subscribe,
            keysList: ['resultDateTime', 'resultDetails'],
            isFilledExpected: false
        });
        if (!scanFieldsResult) {
            return scanFieldsResult;
        }
        return null;
    }

    scanFields(data) {
        const { subscribe, keysList, isFilledExpected } = data;
        let scanFieldsResult = null;
        for (let i = 0; i < keysList.length; i++) {
            const key = keysList[i];
            const value = subscribe[key];
            if (isFilledExpected) {
                if (!value) {
                    scanFieldsResult = {
                        status: SubscribeStatus.MISSING_FIELD,
                        details: `Field ${key} should not be empty, but does not contain any value.`
                    };
                    break;
                }
            }
            else {
                if (value) {
                    scanFieldsResult = {
                        status: SubscribeStatus.UNEXPECTED_FIELD,
                        details: `Field ${key} should be empty, but found the value ${value}.`
                    };
                    break;
                }
            }
        }
        return scanFieldsResult;
    }

    compareSubscribers(subscribe) {
        // Check if duplicate subscribes exists, not to enter subscribe URL several times.
        if (subscribe.status !== SubscribeStatus.CREATE) {
            return;
        }
        for (let i = 0; i < this.subscribesData.subscribeList.length; i++) {
            const currentSubscribe = this.subscribesData.subscribeList[i];
            if (subscribe.id === currentSubscribe.id || currentSubscribe.status !== CourseStatus.CREATE) {
                continue;
            }
            if (subscribe.urlAddressCompare === currentSubscribe.urlAddressCompare) {
                this.subscribesData.subscribeList[i] = this.updateSubscribeStatus({
                    course: currentSubscribe,
                    status: CourseStatus.DUPLICATE,
                    details: 'This course repeats multiple times in this session and should be purchased.'
                });
            }
        }
    }

    updateSubscribeStatus(data) {
        const { subscribe, status, details } = data;
        const originalStatus = subscribe.status;
        subscribe.status = status;
        subscribe.resultDateTime = new Date();
        subscribe.resultDetails.push(details);
        if (originalStatus !== CourseStatus.CREATE) {
            this.subscribesData.updateCount(false, originalStatus, 1);
        }
        this.subscribesData.updateCount(true, status, 1);
        return subscribe;
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
            // Compare subscribes and detect duplicates.
            /*             //this.compare(subscribe) */
                    //textUtils.toLowerCaseTrim(result.udemyURL)
/*             const updatedSubscribe = this.compare(subscribe);
        if (updatedSubscribe) {
            return updatedSubscribe;
        } */
/*         return null; */
/*                 return subscribe; */
/*         const isExistsOne = false; */
/*             if (subscribe) {
                this.subscribesData.subscribeList.push(subscribe);
            } */
/*         subscribe.id = this.lastSubscribeId; */
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