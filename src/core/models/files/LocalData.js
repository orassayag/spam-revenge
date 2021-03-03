class LocalData {

	constructor(data) {
        const { ipv4Address, subnetMask } = data;
        this.localIPAddress = ipv4Address;
        this.subnetIPAddress = subnetMask;
        this.publicIPAddress = null;
    }
}

module.exports = LocalData;
/* ipv4Address: address,
subnetMask: netmask */