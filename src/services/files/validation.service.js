const isReachable = require('is-reachable');

class ValidationService {

    constructor() { }

    async validateURL(data) {
        const { url, maximumRetries } = data;
        let isConnected = false;
        for (let i = 0; i < maximumRetries; i++) {
            try {
                isConnected = await isReachable(url);
            } catch (error) { isConnected = false; }
            if (isConnected) {
                break;
            }
        }
        if (!isConnected) {
            throw new Error(`${url} is not available (1000023)`);
        }
    }
}

module.exports = new ValidationService();