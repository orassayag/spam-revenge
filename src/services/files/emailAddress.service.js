const { EmailAddressesDataModel } = require('../../core/models');
const { ignoreEmailAddressesList } = require('../../configurations');
const countLimitService = require('./countLimit.service');
const { textUtils, validationUtils } = require('../../utils');

class EmailAddressService {

    constructor() {
        this.emailAddressesArray = null;
        this.emailAddressesDataModel = null;
    }

    initiate(settings) {
        // ===GENERAL=== //
        const { EMAIL_ADDRESSES } = settings;
        this.emailAddressesArray = EMAIL_ADDRESSES;
        if (!validationUtils.isExists(this.emailAddressesArray)) {
            throw new Error('No valid email addresses to subscribe were found (1000003)');
        }
    }

    setEmailAddressesList() {
        this.emailAddressesDataModel = new EmailAddressesDataModel();
        // Validate all the email addresses from settings.
        for (let i = 0; i < this.emailAddressesArray.length; i++) {
            const emailAddress = this.emailAddressesArray[i];
            if (this.validateEmailAddress(emailAddress)) {
                this.emailAddressesDataModel.emailAddressesList.push(emailAddress);
            }
        }
        // Clear duplicates.
        this.emailAddressesDataModel.emailAddressesList = textUtils.removeDuplicates(this.emailAddressesDataModel.emailAddressesList);
        // Check if exceeded, take first X elements.
        this.emailAddressesDataModel.emailAddressesList = textUtils.getElements({
            list: this.emailAddressesDataModel.emailAddressesList,
            count: countLimitService.countLimitDataModel.maximumEmailAddressesCount,
            isRandomIfExceeded: false
        });
        // Validate the existence of at least one valid email address.
        if (!validationUtils.isExists(this.emailAddressesDataModel.emailAddressesList)) {
            throw new Error('No valid email addresses to subscribe were found (1000004)');
        }
    }

    validateEmailAddress(emailAddress) {
        if (!emailAddress) {
            return false;
        }
        if (!validationUtils.isValidEmailAddress(emailAddress)) {
            return false;
        }
        if (ignoreEmailAddressesList.indexOf(emailAddress) > -1) {
            return false;
        }
        return true;
    }
}

module.exports = new EmailAddressService();