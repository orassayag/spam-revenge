const { LocalDataModel } = require('../../core/models');
const puppeteerService = require('./puppeteer.service');
const { localUtils, validationUtils } = require('../../utils');

class LocalService {

    constructor() {
        this.localDataModel = null;
    }

    async setLocalData() {
        this.localDataModel = new LocalDataModel(localUtils.getLocalData());
        const responseDataModel = await puppeteerService.getResponseData(null);
        if (!responseDataModel) {
            throw new Error('Failed to get local public IP address (1000014)');
        }
        this.localDataModel.publicIPAddress = responseDataModel.publicIPAddress;
        ['localIPAddress', 'subnetIPAddress', 'publicIPAddress'].map(key => {
            const ipAddress = this.localDataModel[key];
            if (!ipAddress || !validationUtils.isValidIPAddress(ipAddress)) {
                throw new Error(`Local ${key} data field contains empty or invalid IP address: ${ipAddress} (1000015)`);
            }
        });
    }
}

module.exports = new LocalService();