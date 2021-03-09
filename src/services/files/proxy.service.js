const ProxyLists = require('proxy-lists');
const { ProxyData } = require('../../core/models');
const { ProxyAnonymityLevel, ProxyProtocol, ProxyStatus, Status } = require('../../core/enums');
const { countriesCodesList } = require('../../configurations');
const countLimitService = require('./countLimit.service');
const puppeteerService = require('./puppeteer.service');
const { textUtils, validationUtils } = require('../../utils');
const globalUtils = require('../../utils/files/global.utils');

class ProxyService {

    constructor() {
        this.proxyData = null;
        this.lastProxyId = 1;
    }

    async setProxy() {
        // Get the proxis list.
        let proxies = await this.getProxies();
        if (!validationUtils.isExists(proxies)) {
            return { exitReason: Status.NO_PROXY_FOUND };
        }
        // Get random X proxies and try to find valid one.
        proxies = textUtils.getElements({
            list: proxies,
            count: countLimitService.countLimitData.maximumProxyValidationsRetriesCount,
            isRandomIfExceeded: true
        });
        for (let i = 0; i < proxies.length; i++) {
            if (await this.validateProxy(proxies[i], i)) {
                break;
            }
            await globalUtils.sleep(1000);
        }
    }

    setProxyStatus(proxyData, status) {
        proxyData.status = status;
        this.proxyData = proxyData;
        return proxyData;
    }

    async validateProxy(proxy, indexId) {
        let proxyData = new ProxyData({
            id: this.lastProxyId,
            indexId: indexId
        });
        // First, validate proxy fields.
        proxyData = this.validateProxyFields({
            proxy: proxy,
            proxyData: proxyData
        });
        // Second, validate proxy connection.
        return await this.validateProxyConnection(proxyData);
        // Third, validate proxy visibility.
    }

    validateProxyFields(data) {
        const { proxy } = data;
        let { proxyData } = data;
        proxyData = this.setProxyStatus(proxyData, ProxyStatus.CREATE);
        if (!proxy) {
            return this.setProxyStatus(proxyData, ProxyStatus.NO_DATA);
        }
        // Validate IP address.
        if (!proxy.ipAddress) {
            return this.setProxyStatus(proxyData, ProxyStatus.MISSING_IP_ADDRESS);
        }
        if (!validationUtils.isValidIPAddress(proxy.ipAddress)) {
            return this.setProxyStatus(proxyData, ProxyStatus.INVALID_IP_ADDRESS);
        }
        proxyData.ipAddress = proxy.ipAddress.trim();
        // Validate port.
        if (!proxy.port) {
            return this.setProxyStatus(proxyData, ProxyStatus.MISSING_PORT);
        }
        if (!validationUtils.isValidPort(proxy.port)) {
            return this.setProxyStatus(proxyData, ProxyStatus.INVALID_PORT);
        }
        proxyData.port = proxy.port;
        // Validate anonymity level.
        if (!proxy.anonymityLevel) {
            return this.setProxyStatus(proxyData, ProxyStatus.MISSING_ANONYMITY_LEVEL);
        }
        proxyData.anonymityLevel = textUtils.toLowerCaseTrim(proxy.anonymityLevel);
        if (!validationUtils.isValidEnum({
            enum: ProxyAnonymityLevel,
            value: proxyData.anonymityLevel
        })) {
            return this.setProxyStatus(proxyData, ProxyStatus.INVALID_ANONYMITY_LEVEL);
        }
        // Validate protocols.
        if (!validationUtils.isExists(proxy.protocols)) {
            return this.setProxyStatus(proxyData, ProxyStatus.MISSING_PROTOCOLS);
        }
        for (let i = 0; i < proxy.protocols.length; i++) {
            const protocol = textUtils.toLowerCaseTrim(proxy.protocols[i]);
            if (protocol === ProxyProtocol.SOCKS4) {
                proxyData.protocol = protocol;
                break;
            }
        }
        if (!proxyData.protocol) {
            return this.setProxyStatus(proxyData, ProxyStatus.INVALID_PROTOCOLS);
        }
        // Validate country.
        if (!proxy.country) {
            return this.setProxyStatus(proxyData, ProxyStatus.MISSING_COUNTRY);
        }
        proxyData.country = textUtils.toLowerCaseTrim(proxy.country);
        if (countriesCodesList.indexOf(proxyData.country) === -1) {
            return this.setProxyStatus(proxyData, ProxyStatus.INVALID_COUNTRY);
        }
        // Validate source.
        if (!proxy.source) {
            return this.setProxyStatus(proxyData, ProxyStatus.MISSING_SOURCE);
        }
        proxyData.source = textUtils.toLowerCaseTrim(proxy.source);
        return proxyData;
    }

    async validateProxyConnection(proxyData) {
        const { ipAddress, port } = proxyData;
        const responseData = await puppeteerService.getResponseData({
            ipAddress: ipAddress,
            port: port
        });
        return responseData.publicIPAddress;
    }

    validateProxyVisibility(proxyData) {

    }

    async getProxies() {
        return await new Promise((resolve, reject) => {
            ProxyLists.getProxies({
                protocols: ['https']
            })
                .on('data', (proxies) => {
                    // Received some proxies.
                    resolve(proxies);
                })
                .on('error', (error) => {
                    // Some error has occurred.
                    reject(error);
                })
                .once('end', () => {
                    // Done getting proxies.
                });
        }).catch(error => {
            // ToDo: Remove this.
            console.log(error);
        });
    }
}

module.exports = new ProxyService();
/*         console.log(proxyData); */
/*         for (let i = 0; i < proxies.length; i++) {
            const proxy = this.validateProxy(proxies[i]);
            const responseData = await puppeteerService.getResponseData();
        } */
/*         {
ipAddress: '1.221.173.148',
port: 4145,
anonymityLevel: 'elite',
protocols: [ 'socks4' ],
country: 'kr',
source: 'proxyscrape-com'
}, */

/*     validateProxy(proxy) {
        if (!proxy) {
            return null;
        }
    } */

/*     validateProxy(proxy) {
        if (!proxy) {
            return null;
        }
        // Validate IP address.
        if (!proxy.ipAddress || !validationUtils.isValidIPAddress(proxy.ipAddress)) {
            return null;
        }
        // Validate port.
        if (!proxy.port || !validationUtils.isValidPort(proxy.port)) {
            return null;
        }



        return new ProxyData(proxy);
    } */
/*     initiate(settings) {
        // ===COUNT & LIMIT=== //
        const { MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT } = settings;
        this.maximumProxyValidationsRetriesCount = MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT;
    } */
/*         if (!validationUtils.isValidIPAddress(this.localData.localIPAddress)) {
            throw new Error('Local localIPAddress data field contains invalid IP address (1000034)');
        }
        if (!validationUtils.isValidIPAddress(this.localData.subnetIPAddress)) {
            throw new Error('Local subnetIPAddress data field contains invalid IP address (1000034)');
        } */
/* this.localIPAddress = ipv4Address;
this.subnetIPAddress = subnetMask;
this.publicIPAddress = null; */

/* const { LocalData } = require('./LocalData'); */
/* 		this.localData = new LocalData(); */