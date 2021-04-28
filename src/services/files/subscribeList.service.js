const { SubscribeDataModel, SubscribesDataModel } = require('../../core/models');
const { MethodEnum, SubscribeStatusEnum } = require('../../core/enums');
const { ignoreSubscribeURLsList } = require('../../configurations');
const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const pathService = require('./path.service');
const { fileUtils, pathUtils, textUtils, timeUtils, validationUtils } = require('../../utils');

class SubscribeListService {

    constructor() {
        this.isRandomSubscribesExceeded = false;
        this.subscribesDataModel = new SubscribesDataModel();
        this.lastSubscribeId = 1;
    }

    initiate(settings) {
        // ===FLAG=== //
        const { IS_RANDOM_SUBSCRIBES_EXCEEDED } = settings;
        this.isRandomSubscribesExceeded = IS_RANDOM_SUBSCRIBES_EXCEEDED;
    }

    async setSubscribeList() {
        const jsonData = await this.getJsonFileData({
            filePath: pathService.pathDataModel.subscribeListFilePath,
            parameterName: 'subscribeListFilePath'
        });
        if (!jsonData) {
            throw new Error('No valid subscribes found to subscribe (1000016)');
        }
        for (let i = 0; i < jsonData.length; i++) {
            this.createSubscribe(jsonData[i], i);
        }
        // Validate all the subscribes.
        this.finalizeCreateSubscribes();
    }

    createSubscribe(subscribeData, index) {
        let subscribe = new SubscribeDataModel({
            id: this.lastSubscribeId,
            indexId: index,
            creationDateTime: timeUtils.getCurrentDate()
        });
        this.lastSubscribeId++;
        subscribe = this.validateSubscribe({
            subscribe: subscribe,
            subscribeData: subscribeData
        });
        this.subscribesDataModel.subscribeList.push(subscribe);
    }

    validateSubscribe(data) {
        const { subscribe, subscribeData } = data;
        if (!subscribeData) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatusEnum.NO_DATA,
                details: 'This subscribe repeats multiple times in this session and should be subscribed.'
            });
        }
        // Validate URL field.
        if (!subscribeData.urlAddress) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatusEnum.MISSING_URL,
                details: 'Empty or no urlAddress field was found.'
            });
        }
        if (!validationUtils.isValidLink(subscribeData.urlAddress)) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatusEnum.INVALID_URL,
                details: 'Invalid urlAddress field was found.'
            });
        }
        subscribe.urlAddress = subscribeData.urlAddress.trim();
        subscribe.urlAddressCompare = textUtils.toLowerCaseTrim(subscribeData.urlAddress);
        // Check if it needs to be ignored.
        if (ignoreSubscribeURLsList.indexOf(subscribe.urlAddress) > -1) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatusEnum.IGNORE,
                details: 'The URL was found in the ignoreSubscribeURLsList and will be ignored.'
            });
        }
        // Validate text box fields.
        if (!subscribeData.textBoxFieldName) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatusEnum.MISSING_TEXTBOX_FIELD,
                details: 'Empty or no textBoxFieldName field was found.'
            });
        }
        if (!subscribeData.textBoxFieldValue) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatusEnum.MISSING_TEXTBOX_VALUE,
                details: 'Empty or no textBoxFieldValue field was found.'
            });
        }
        subscribe.textBoxFieldName = subscribeData.textBoxFieldName.trim();
        subscribe.textBoxFieldValue = subscribeData.textBoxFieldValue.trim();
        // Validate button fields.
        if (!subscribeData.buttonFieldName) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatusEnum.MISSING_BUTTON_FIELD,
                details: 'Empty or no buttonFieldName field was found.'
            });
        }
        if (!subscribeData.buttonFieldValue) {
            return this.updateSubscribeStatus({
                subscribe: subscribe,
                status: SubscribeStatusEnum.MISSING_BUTTON_VALUE,
                details: 'Empty or no buttonFieldValue field was found.'
            });
        }
        subscribe.buttonFieldName = subscribeData.buttonFieldName.trim();
        subscribe.buttonFieldValue = subscribeData.buttonFieldValue.trim();
        return subscribe;
    }

    finalizeCreateSubscribes() {
        // Validate any subscribes exists to subscribe.
        if (!validationUtils.isExists(this.subscribesDataModel.subscribeList)) {
            throw new Error('No valid subscribes found to subscribe (1000017)');
        }
        for (let i = 0; i < this.subscribesDataModel.subscribeList.length; i++) {
            const subscribe = this.subscribesDataModel.subscribeList[i];
            // Validate all fields.
            let scanFieldsResult = this.validateFields(subscribe);
            if (scanFieldsResult) {
                this.subscribesDataModel.subscribeList[i] = this.updateSubscribeStatus({
                    subscribe: subscribe,
                    status: scanFieldsResult.status,
                    details: scanFieldsResult.details
                });
            }
            // Compare subscribes and detect duplicates.
            this.compareSubscribers(subscribe);
        }
        // Check if exceeded and if to take random or not.
        this.subscribesDataModel.subscribeList = textUtils.getElements({
            list: this.subscribesDataModel.subscribeList,
            count: countLimitService.countLimitDataModel.maximumSubscribesCount,
            isRandomIfExceeded: this.isRandomSubscribesExceeded
        });
        // Validate that there are any subscribes to subscribe.
        if (!validationUtils.isExists(this.subscribesDataModel.subscribeList.filter(s => s.status === SubscribeStatusEnum.CREATE))) {
            throw new Error('No valid subscribes found to subscribe (1000018)');
        }
        applicationService.applicationDataModel.method = this.subscribesDataModel.subscribeList.length > countLimitService.countLimitDataModel.maximumSubscribesCount &&
            this.isRandomSubscribesExceeded ? MethodEnum.RANDOM : MethodEnum.STANDARD;
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
                        status: SubscribeStatusEnum.MISSING_FIELD,
                        details: `Field ${key} should not be empty, but does not contain any value.`
                    };
                    break;
                }
            }
            else {
                if (value) {
                    scanFieldsResult = {
                        status: SubscribeStatusEnum.UNEXPECTED_FIELD,
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
        if (subscribe.status !== SubscribeStatusEnum.CREATE) {
            return;
        }
        for (let i = 0; i < this.subscribesDataModel.subscribeList.length; i++) {
            const currentSubscribe = this.subscribesDataModel.subscribeList[i];
            if (subscribe.id === currentSubscribe.id || currentSubscribe.status !== SubscribeStatusEnum.CREATE) {
                continue;
            }
            if (subscribe.urlAddressCompare === currentSubscribe.urlAddressCompare) {
                this.subscribesDataModel.subscribeList[i] = this.updateSubscribeStatus({
                    course: currentSubscribe,
                    status: SubscribeStatusEnum.DUPLICATE,
                    details: 'This subscribe repeats multiple times in this session and should be subscribed.'
                });
            }
        }
    }

    updateSubscribeStatus(data) {
        const { subscribe, status, details } = data;
        const originalStatus = subscribe.status;
        subscribe.status = status;
        subscribe.resultDateTime = timeUtils.getCurrentDate();
        subscribe.resultDetails.push(details);
        if (originalStatus !== SubscribeStatusEnum.CREATE) {
            this.subscribesDataModel.updateCount(false, originalStatus, 1);
        }
        this.subscribesDataModel.updateCount(true, status, 1);
        return subscribe;
    }

    async getJsonFileData(data) {
        const { filePath, parameterName } = data;
        if (!await fileUtils.isPathExists(filePath)) {
            throw new Error(`Path not found: ${filePath} (1000019)`);
        }
        if (!fileUtils.isFilePath(filePath)) {
            throw new Error(`The parameter path ${parameterName} marked as file but it's a path of a directory: ${filePath} (1000020)`);
        }
        const extension = pathUtils.getExtension(filePath);
        if (extension !== '.json') {
            throw new Error(`The parameter path ${parameterName} must be a .json file but it's: ${extension} file (1000021)`);
        }
        const fileData = await fileUtils.read(filePath);
        const jsonData = JSON.parse(fileData);
        if (!validationUtils.isExists(jsonData)) {
            throw new Error(`No data exists in the file: ${filePath} (1000022)`);
        }
        return jsonData;
    }
}

module.exports = new SubscribeListService();