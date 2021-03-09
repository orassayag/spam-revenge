const { EmailAddressesData } = require('../../core/models');
const { ignoreEmailAddressesList } = require('../../configurations');
const countLimitService = require('./countLimit.service');
const { textUtils, validationUtils } = require('../../utils');

class EmailAddressService {

    constructor() {
        this.emailAddressesArray = null;
        this.emailAddressesData = null;
    }

    initiate(settings) {
        // ===GENERAL=== //
        const { EMAIL_ADDRESSES } = settings;
        this.emailAddressesArray = EMAIL_ADDRESSES;
        if (!validationUtils.isExists(this.emailAddressesArray)) {
            throw new Error('No valid email addresses to subscribe were found (1000045)');
        }
    }

    setEmailAddressesList() {
        this.emailAddressesData = new EmailAddressesData();
        // Validate all the email addresses from settings.
        for (let i = 0; i < this.emailAddressesArray.length; i++) {
            const emailAddress = this.emailAddressesArray[i];
            if (this.validateEmailAddress(emailAddress)) {
                this.emailAddressesData.emailAddressesList.push(emailAddress);
            }
        }
        // Clear duplicates.
        this.emailAddressesData.emailAddressesList = textUtils.removeDuplicates(this.emailAddressesData.emailAddressesList);
        // Check if exceeded, take first X elements.
        this.emailAddressesData.emailAddressesList = textUtils.getElements({
            list: this.emailAddressesData.emailAddressesList,
            count: countLimitService.countLimitData.maximumEmailAddressesCount,
            isRandomIfExceeded: false
        });
        // Validate the existence of at least one valid email address.
        if (!validationUtils.isExists(this.emailAddressesData.emailAddressesList)) {
            throw new Error('No valid email addresses to subscribe were found (1000045)');
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
        /*         this.emailAddressesData.emailAddressesList = textUtils.getElements(this.emailAddressesData.emailAddressesList,
                    countLimitService.countLimitData.maximumEmailAddressesCount, false); */
/*         console.log(this.emailAddressesData.emailAddressesList); */
        //this.emailAddressesData.emailAddressesList.slice(0, countLimitService.countLimitData.maximumEmailAddressesCount);
/*         console.log(this.emailAddressesData.emailAddressesList); */
/*     setEmailAddressesList(settings) {
        // ===GENERAL=== //
        const { TARGET_EMAIL_ADDRESSES } = settings;
        this.emailAddressesData = new EmailAddressesData();
        // Validate all the email addresses from settings.
        for (let i = 0; i < TARGET_EMAIL_ADDRESSES.length; i++) {
            const emailAddress = TARGET_EMAIL_ADDRESSES[i];
            if (this.validateEmailAddress(emailAddress)) {
                this.emailAddressesData.emailAddressesList.push(emailAddress);
            }
        }
        // Validate the existence of at least 1 email address.
        if (!validationUtils.isExists(this.emailAddressesData.emailAddressesList)) {
            throw new Error('No valid email addresses to subscribe were found (1000045)');
        }
    } */