class ProxyData {

    constructor(proxy) {
        const { id, indexId } = proxy;
        this.id = id;
        this.indexId = indexId;
        this.creationDateTime = new Date();
        this.ipAddress = null;
        this.port = null;
        this.anonymityLevel = null;
        this.protocol = null;
        this.country = null;
        this.source = null;
        this.status = null;
    }
}

module.exports = ProxyData;

/* class ProxyData {

    constructor(proxy) {
        const { ipAddress, port, anonymityLevel, protocols, country, source } = proxy;
        this.ipAddress = ipAddress;
        this.port = port;
        this.anonymityLevel = anonymityLevel;
        this.protocols = protocols;
        this.country = country;
        this.source = source;
        this.status = null;
    }
}

module.exports = ProxyData; */