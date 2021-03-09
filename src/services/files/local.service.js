const { LocalData } = require('../../core/models');
const puppeteerService = require('./puppeteer.service');
const { localUtils, validationUtils } = require('../../utils');

class LocalService {

    constructor() {
        this.localData = null;
    }

    async setLocalData() {
        this.localData = new LocalData(localUtils.getLocalData());
        const responseData = await puppeteerService.getResponseData(null);
        if (!responseData) {
            throw new Error('Failed to get local public IP address (1000034)');
        }
        this.localData.publicIPAddress = responseData.publicIPAddress;
		['localIPAddress', 'subnetIPAddress', 'publicIPAddress'].map(key => {
			const ipAddress = this.localData[key];
			if (!ipAddress || !validationUtils.isValidIPAddress(ipAddress)) {
                throw new Error(`Local ${key} data field contains empty or invalid IP address: ${ipAddress} (1000034)`);
			}
		});
    }
}

module.exports = new LocalService();
/*         if (!validationUtils.isValidIPAddress(this.localData.localIPAddress)) {
            throw new Error('Local localIPAddress data field contains invalid IP address (1000034)');
        }
        if (!validationUtils.isValidIPAddress(this.localData.subnetIPAddress)) {
            throw new Error('Local subnetIPAddress data field contains invalid IP address (1000034)');
        } */
/* this.localIPAddress = ipv4Address;
this.subnetIPAddress = subnetMask;
this.publicIPAddress = null; */

/* const { LocalData } = require('./LocalData'); */
/* 		this.localData = new LocalData(); */