const { SubscribeData, SubscribesData } = require('../../core/models');
const { SubscribeStatus, Method } = require('../../core/enums');
const { ignoreSubscribeURLsList } = require('../../configurations');
const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const pathService = require('./path.service');
const { fileUtils, pathUtils, textUtils, validationUtils } = require('../../utils');

class SubscribeListService {

    constructor() {
        this.isRandomSubscribesExceeded = false;
        this.subscribesData = new SubscribesData();
        this.lastSubscribeId = 1;
    }

    initiate(settings) {
        // ===FLAG=== //
        const { IS_RANDOM_SUBSCRIBES_EXCEEDED } = settings;
        this.isRandomSubscribesExceeded = IS_RANDOM_SUBSCRIBES_EXCEEDED;
    }

    async setSubscribeList() {
        const jsonData = await this.getJsonFileData({
            filePath: pathService.pathData.subscribeListFilePath,
            parameterName: 'subscribeListFilePath'
        });
        if (!jsonData) {
            throw new Error('No valid subscribes found to subscribe (1000034)');
        }
        for (let i = 0; i < jsonData.length; i++) {
            this.createSubscribe(jsonData[i], i);
        }
        // Validate all the subscribes.
        this.finalizeCreateSubscribes();
    }

    createSubscribe(subscribeData, index) {
        let subscribe = new SubscribeData({
            id: this.lastSubscribeId,
            indexId: index
        });
        this.lastSubscribeId++;
        subscribe = this.validateSubscribe({
            subscribe: subscribe,
            subscribeData: subscribeData
        });
        this.subscribesData.subscribeList.push(subscribe);
    }

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
        if (!subscribeData.urlAddress) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.MISSING_URL,
                details: 'Empty or no urlAddress field was found.'
            });
        }
        if (!validationUtils.isValidLink(subscribeData.urlAddress)) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.INVALID_URL,
                details: 'Invalid urlAddress field was found.'
            });
        }
        subscribe.urlAddress = subscribeData.urlAddress.trim();
        subscribe.urlAddressCompare = textUtils.toLowerCaseTrim(subscribeData.urlAddress);
        // Check if it needs to be ignored.
        if (ignoreSubscribeURLsList.indexOf(subscribe.urlAddress) > -1) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.IGNORE,
                details: 'The URL was found in the ignoreSubscribeURLsList and will be ignored.'
            });
        }
        // Validate text box fields.
        if (!subscribeData.textBoxFieldName) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.MISSING_TEXTBOX_FIELD,
                details: 'Empty or no textBoxFieldName field was found.'
            });
        }
        if (!subscribeData.textBoxFieldValue) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.MISSING_TEXTBOX_VALUE,
                details: 'Empty or no textBoxFieldValue field was found.'
            });
        }
        subscribe.textBoxFieldName = subscribeData.textBoxFieldName.trim();
        subscribe.textBoxFieldValue = subscribeData.textBoxFieldValue.trim();
        // Validate button fields.
        if (!subscribeData.buttonFieldName) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.MISSING_BUTTON_FIELD,
                details: 'Empty or no buttonFieldName field was found.'
            });
        }
        if (!subscribeData.buttonFieldValue) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatus.MISSING_BUTTON_VALUE,
                details: 'Empty or no buttonFieldValue field was found.'
            });
        }
        subscribe.buttonFieldName = subscribeData.buttonFieldName.trim();
        subscribe.buttonFieldValue = subscribeData.buttonFieldValue.trim();
        return subscribe;
    }

    finalizeCreateSubscribes() {
        // Validate any subscribes exists to subscribe.
        if (!validationUtils.isExists(this.subscribesData.subscribeList)) {
            throw new Error('No valid subscribes found to subscribe (1000034)');
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
        // Check if exceeded and if to take random or not.
        this.subscribesData.subscribeList = textUtils.getElements({
            list: this.subscribesData.subscribeList,
            count: countLimitService.countLimitData.maximumSubscribesCount,
            isRandomIfExceeded: this.isRandomSubscribesExceeded
        });
        // Validate that there are any subscribes to subscribe.
        if (!validationUtils.isExists(this.subscribesData.subscribeList.filter(s => s.status === SubscribeStatus.CREATE))) {
            throw new Error('No valid subscribes found to subscribe (1000034)');
        }
        applicationService.applicationData.method = this.subscribesData.subscribeList.length > countLimitService.countLimitData.maximumSubscribesCount &&
            this.isRandomSubscribesExceeded ? Method.RANDOM : Method.STANDARD;
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
        // Check if duplicate subscribes exist, not to enter the subscribe URL several times.
        if (subscribe.status !== SubscribeStatus.CREATE) {
            return;
        }
        for (let i = 0; i < this.subscribesData.subscribeList.length; i++) {
            const currentSubscribe = this.subscribesData.subscribeList[i];
            if (subscribe.id === currentSubscribe.id || currentSubscribe.status !== SubscribeStatus.CREATE) {
                continue;
            }
            if (subscribe.urlAddressCompare === currentSubscribe.urlAddressCompare) {
                this.subscribesData.subscribeList[i] = this.updateSubscribeStatus({
                    course: currentSubscribe,
                    status: SubscribeStatus.DUPLICATE,
                    details: 'This subscribe repeats multiple times in this session and should be subscribed.'
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
        if (originalStatus !== SubscribeStatus.CREATE) {
            this.subscribesData.updateCount(false, originalStatus, 1);
        }
        this.subscribesData.updateCount(true, status, 1);
        return subscribe;
    }

    async getJsonFileData(data) {
        const { filePath, parameterName } = data;
        if (!await fileUtils.isPathExists(filePath)) {
            throw new Error(`Invalid or no ${parameterName} parameter was found: Expected a number but received: ${filePath} (1000010)`);
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
/*         console.log(this.subscribesData.subscribeList); */
/*         this.subscribesData.subscribe = subscribe; */
/*         // Check if exceeded and if to take random or not.
        this.subscribesData.subscribeList = textUtils.getElements(this.subscribesData.subscribeList,
            countLimitService.countLimitData.maximumSubscribesCount, this.isRandomSubscribesExceeded); */
/*             console.log(this.subscribesData.subscribeList); */
            //this.filterSubscribes();
/*     filterSubscribes() {
        if (this.subscribesData.subscribeList.length > countLimitService.countLimitData.maximumSubscribesCount) {
            // Check if exceeded, take random or first X elements.
            this.subscribesData.subscribeList = this.isRandomSubscribesExceeded ? textUtils.getRandomElements(this.subscribesData.subscribeList,
                countLimitService.countLimitData.maximumSubscribesCount) : textUtils.getFirstElements(this.subscribesData.subscribeList,
                    countLimitService.countLimitData.maximumSubscribesCount);
        }
    } */
/*             if (this.isRandomSubscribesExceeded) {
                this.subscribesData.subscribeList = textUtils.getRandomElements(this.subscribesData.subscribeList,
                    countLimitService.countLimitData.maximumSubscribesCount);
            }
            else {
                // Check if exceeded, take first X.
                this.subscribesData.subscribeList = textUtils.getFirstElements(this.subscribesData.subscribeList,
                    countLimitService.countLimitData.maximumSubscribesCount);
            } */
                //this.subscribesData.subscribeList.slice(0, countLimitService.countLimitData.maximumSubscribesCount);
                //let random = array.sort(() => .5 - Math.random()).slice(0,n);
/*         if (this.subscribesData.subscribeList.filter(s => s.status === SubscribeStatus.CREATE).length <= 0) {
throw new Error('No valid subscribes found to subscribe (1000034)');
} */
/*         console.log(this.subscribesData.subscribeList); */
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
        this.accountData.asterixPassword = textUtils.getAsteriskCharactersString(validationResult.password.length);
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