const { SubscribeStatusEnum } = require('../../enums');

class SubscribesDataModel {

	constructor() {
		this.subscribeList = [];
		this.subscribe = null;
		const keysList = Object.values(SubscribeStatusEnum);
		for (let i = 0; i < keysList.length; i++) {
			this[`${keysList[i]}Count`] = 0;
		}
	}

	updateCount(isAdd, counterName, count) {
		const fieldName = `${counterName}Count`;
		if (Object.prototype.hasOwnProperty.call(this, fieldName)) {
			if (isAdd) {
				this[fieldName] += count;
			} else {
				this[fieldName] -= count;
				if (this[fieldName] <= 1) {
					return 0;
				}
			}
		}
	}
}

module.exports = SubscribesDataModel;