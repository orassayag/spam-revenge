const { applicationUtils, timeUtils } = require('../../../utils');

class ApplicationDataModel {

	constructor(data) {
		// Set the parameters from the settings file.
		const { settings, status } = data;
		const { MODE, PUBLIC_IP_ADDRESS_URL, IS_PRODUCTION_ENVIRONMENT, VALIDATION_CONNECTION_LINK } = settings;
		this.isProductionEnvironment = IS_PRODUCTION_ENVIRONMENT;
		this.environment = applicationUtils.getApplicationEnvironment(this.isProductionEnvironment);
		this.mode = MODE;
		this.publicIPAddressURL = PUBLIC_IP_ADDRESS_URL;
		this.status = status;
		this.startDateTime = null;
		this.logDateTime = timeUtils.getFullDateNoSpaces();
		this.validationConnectionLink = VALIDATION_CONNECTION_LINK;
	}
}

module.exports = ApplicationDataModel;