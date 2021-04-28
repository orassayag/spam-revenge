const os = require('os');
const validationUtils = require('./validation.utils');

class LocalUtils {

    constructor() { }

    getLocalData() {
        const networkInterfaces = os.networkInterfaces();
        if (!networkInterfaces) {
            return null;
        }
        const vEthernet = networkInterfaces['vEthernet (Default Switch)'];
        if (!validationUtils.isExists(vEthernet) || vEthernet.length !== 2) {
            return null;
        }
        const { address, netmask } = vEthernet[1];
        return {
            ipv4Address: address,
            subnetMask: netmask
        };
    }
}

module.exports = new LocalUtils();