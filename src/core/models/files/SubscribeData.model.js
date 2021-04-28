const { SubscribeStatusEnum } = require('../../enums');

class SubscribeDataModel {

    constructor(subscribe) {
        const { id, indexId, creationDateTime } = subscribe;
        this.id = id;
        this.indexId = indexId;
        this.creationDateTime = creationDateTime;
        this.urlAddress = null;
        this.urlAddressCompare = null;
        this.textBoxFieldName = null;
        this.textBoxFieldValue = null;
        this.buttonFieldName = null;
        this.buttonFieldValue = null;
        this.status = SubscribeStatusEnum.CREATE;
        this.resultDateTime = null;
        this.resultDetails = [];
    }
}

module.exports = SubscribeDataModel;