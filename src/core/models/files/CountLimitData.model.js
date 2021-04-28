class CountLimitDataModel {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { MAXIMUM_EMAIL_ADDRESSES_COUNT, MAXIMUM_SUBSCRIBES_COUNT, MILLISECONDS_TIMEOUT_EXIT_APPLICATION,
			MAXIMUM_VALIDATE_INTERNET_CONNECTION_RETRIES_COUNT, MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT } = settings;
		this.maximumEmailAddressesCount = MAXIMUM_EMAIL_ADDRESSES_COUNT;
		this.maximumSubscribesCount = MAXIMUM_SUBSCRIBES_COUNT;
		this.millisecondsTimeoutExitApplication = MILLISECONDS_TIMEOUT_EXIT_APPLICATION;
		this.maximumValidateInternetConnectionRetriesCount = MAXIMUM_VALIDATE_INTERNET_CONNECTION_RETRIES_COUNT;
		this.maximumProxyValidationsRetriesCount = MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT;
	}
}

module.exports = CountLimitDataModel;