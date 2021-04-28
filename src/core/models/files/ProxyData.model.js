class ProxyDataModel {

    constructor(proxy) {
        const { id, indexId, creationDateTime } = proxy;
        this.id = id;
        this.indexId = indexId;
        this.creationDateTime = creationDateTime;
        this.ipAddress = null;
        this.port = null;
        this.anonymityLevel = null;
        this.protocol = null;
        this.country = null;
        this.source = null;
        this.status = null;
    }
}

module.exports = ProxyDataModel;