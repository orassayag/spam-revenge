const { EmailAddressesData } = require('../../core/models');
const { ignoreTargetEmailAddressesList } = require('../../configurations');
const { validationUtils } = require('../../utils');

class EmailAddressService {

    constructor() {
        this.emailAddressesData = null;
    }

    setEmailAddressesList(settings) {
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
            throw new Error('No email addresses to subscribe were found (1000045)');
        }
    }

    validateEmailAddress(emailAddress) {
        if (!emailAddress) {
            return false;
        }
        if (!validationUtils.isValidEmailAddress(emailAddress)) {
            return false;
        }
        if (ignoreTargetEmailAddressesList.indexOf(emailAddress) > -1) {
            return false;
        }
        return true;
    }
}

module.exports = new EmailAddressService();