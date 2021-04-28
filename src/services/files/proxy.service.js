const ProxyLists = require('proxy-lists');
const { ProxyDataModel } = require('../../core/models');
const { ProxyAnonymityLevelEnum, ProxyProtocolEnum, ProxyStatusEnum, StatusEnum } = require('../../core/enums');
const { countriesCodesList } = require('../../configurations');
const countLimitService = require('./countLimit.service');
const puppeteerService = require('./puppeteer.service');
const globalUtils = require('../../utils/files/global.utils');
const { textUtils, timeUtils, validationUtils } = require('../../utils');

class ProxyService {

    constructor() {
        this.proxyDataModel = null;
        this.lastProxyId = 1;
    }

    async setProxy() {
        // Get the proxies list.
        let proxies = await this.getProxies();
        if (!validationUtils.isExists(proxies)) {
            return { exitReason: StatusEnum.NO_PROXY_FOUND };
        }
        // Get random X proxies and try to find a valid one.
        proxies = textUtils.getElements({
            list: proxies,
            count: countLimitService.countLimitDataModel.maximumProxyValidationsRetriesCount,
            isRandomIfExceeded: true
        });
        for (let i = 0; i < proxies.length; i++) {
            if (await this.validateProxy(proxies[i], i)) {
                break;
            }
            await globalUtils.sleep(1000);
        }
    }

    setProxyStatus(proxyDataModel, status) {
        proxyDataModel.status = status;
        this.proxyDataModel = proxyDataModel;
        return proxyDataModel;
    }

    async validateProxy(proxy, indexId) {
        let proxyDataModel = new ProxyDataModel({
            id: this.lastProxyId,
            indexId: indexId,
            creationDateTime: timeUtils.getCurrentDate()
        });
        // First, validate proxy fields.
        proxyDataModel = this.validateProxyFields({
            proxy: proxy,
            proxyDataModel: proxyDataModel
        });
        // Second, validate proxy connection.
        return await this.validateProxyConnection(proxyDataModel);
        // Third, validate proxy visibility.
    }

    validateProxyFields(data) {
        const { proxy } = data;
        let { proxyDataModel } = data;
        proxyDataModel = this.setProxyStatus(proxyDataModel, ProxyStatusEnum.CREATE);
        if (!proxy) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.NO_DATA);
        }
        // Validate IP address.
        if (!proxy.ipAddress) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.MISSING_IP_ADDRESS);
        }
        if (!validationUtils.isValidIPAddress(proxy.ipAddress)) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.INVALID_IP_ADDRESS);
        }
        proxyDataModel.ipAddress = proxy.ipAddress.trim();
        // Validate port.
        if (!proxy.port) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.MISSING_PORT);
        }
        if (!validationUtils.isValidPort(proxy.port)) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.INVALID_PORT);
        }
        proxyDataModel.port = proxy.port;
        // Validate anonymity level.
        if (!proxy.anonymityLevel) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.MISSING_ANONYMITY_LEVEL);
        }
        proxyDataModel.anonymityLevel = textUtils.toLowerCaseTrim(proxy.anonymityLevel);
        if (!validationUtils.isValidEnum({
            enum: ProxyAnonymityLevelEnum,
            value: proxyDataModel.anonymityLevel
        })) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.INVALID_ANONYMITY_LEVEL);
        }
        // Validate protocols.
        if (!validationUtils.isExists(proxy.protocols)) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.MISSING_PROTOCOLS);
        }
        for (let i = 0; i < proxy.protocols.length; i++) {
            const protocol = textUtils.toLowerCaseTrim(proxy.protocols[i]);
            if (protocol === ProxyProtocolEnum.SOCKS4) {
                proxyDataModel.protocol = protocol;
                break;
            }
        }
        if (!proxyDataModel.protocol) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.INVALID_PROTOCOLS);
        }
        // Validate country.
        if (!proxy.country) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.MISSING_COUNTRY);
        }
        proxyDataModel.country = textUtils.toLowerCaseTrim(proxy.country);
        if (countriesCodesList.indexOf(proxyDataModel.country) === -1) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.INVALID_COUNTRY);
        }
        // Validate source.
        if (!proxy.source) {
            return this.setProxyStatus(proxyDataModel, ProxyStatusEnum.MISSING_SOURCE);
        }
        proxyDataModel.source = textUtils.toLowerCaseTrim(proxy.source);
        return proxyDataModel;
    }

    async validateProxyConnection(proxyData) {
        const { ipAddress, port } = proxyData;
        const responseDataModel = await puppeteerService.getResponseData({
            ipAddress: ipAddress,
            port: port
        });
        return responseDataModel.publicIPAddress;
    }

    validateProxyVisibility() { }

    async getProxies() {
        return await new Promise((resolve, reject) => {
            ProxyLists.getProxies({
                protocols: ['https']
            }).on('data', (proxies) => {
                // Received some proxies.
                resolve(proxies);
            }).on('error', (error) => {
                // Some error has occurred.
                reject(error);
            }).once('end', () => {
                // Done getting proxies.
            });
        }).catch(error => {
            // ToDo: Remove this.
            console.log(error);
        });
    }
}

module.exports = new ProxyService();