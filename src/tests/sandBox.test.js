require('../services/files/initiate.service').initiate('test');

(async () => {
})();


/* const publicIp = require('public-ip');

console.log(await publicIp.v6()); */
/*     const ProxyList = require('free-proxy');
    let proxies;
    try {
        const proxyList = new ProxyList();
        proxies = await proxyList.get();
    } catch (error) {
        throw new Error(error);
    }
    console.log(proxies); */
/* const { ProxyData } = require('../core/models');
const { ProxyAnonymityLevel, ProxyProtocol, ProxyStatus } = require('../core/enums');
const { countriesCodesList } = require('../configurations');
const { validationUtils, textUtils } = require('../utils'); */
/*
const setProxyStatus = (proxyData, status) => {
    proxyData.status = status;
    return proxyData;
};

const validateProxyFields = (proxy) => {
    const proxyData = new ProxyData(ProxyStatus.VALID);
    if (!proxy) {
        return setProxyStatus(proxyData, ProxyStatus.NO_DATA);
    }
    // Validate IP address.
    if (!proxy.ipAddress) {
        return setProxyStatus(proxyData, ProxyStatus.MISSING_IP_ADDRESS);
    }
    if (!validationUtils.isValidIPAddress(proxy.ipAddress)) {
        return setProxyStatus(proxyData, ProxyStatus.INVALID_IP_ADDRESS);
    }
    proxyData.ipAddress = proxy.ipAddress.trim();
    // Validate port.
    if (!proxy.port) {
        return setProxyStatus(proxyData, ProxyStatus.MISSING_PORT);
    }
    if (!validationUtils.isValidPort(proxy.port)) {
        return setProxyStatus(proxyData, ProxyStatus.INVALID_PORT);
    }
    proxyData.port = proxy.port;
    // Validate anonymity level.
    if (!proxy.anonymityLevel) {
        return setProxyStatus(proxyData, ProxyStatus.MISSING_ANONYMITY_LEVEL);
    }
    proxyData.anonymityLevel = textUtils.toLowerCaseTrim(proxy.anonymityLevel);
    if (!validationUtils.isValidEnum({
        enum: ProxyAnonymityLevel,
        value: proxyData.anonymityLevel
    })) {
        return setProxyStatus(proxyData, ProxyStatus.INVALID_ANONYMITY_LEVEL);
    }
    // Validate protocols.
    if (!validationUtils.isExists(proxy.protocols)) {
        return setProxyStatus(proxyData, ProxyStatus.MISSING_PROTOCOLS);
    }
    for (let i = 0; i < proxy.protocols.length; i++) {
        const protocol = textUtils.toLowerCaseTrim(proxy.protocols[i]);
        if (protocol === ProxyProtocol.SOCKS4) {
            proxyData.protocol = protocol;
            break;
        }
    }
    if (!proxyData.protocol) {
        return setProxyStatus(proxyData, ProxyStatus.INVALID_PROTOCOLS);
    }
    // Validate country.
    if (!proxy.country) {
        return setProxyStatus(proxyData, ProxyStatus.MISSING_COUNTRY);
    }
    proxyData.country = textUtils.toLowerCaseTrim(proxy.country);
    if (countriesCodesList.indexOf(proxyData.country) === -1) {
        return setProxyStatus(proxyData, ProxyStatus.INVALID_COUNTRY);
    }
    // Validate source.
    if (!proxy.source) {
        return setProxyStatus(proxyData, ProxyStatus.MISSING_SOURCE);
    }
    proxyData.source = textUtils.toLowerCaseTrim(proxy.source);
    return proxyData;
}; */

/*     const proxy = {
    ipAddress: '1.221.173.148',
    port: 4145,
    anonymityLevel: 'elite',
    protocols: ['socks4'],
    country: 'kr',
    source: 'proxyscrape-com'
};
console.log(validateProxyFields(proxy)); */
/*             const protocol = proxy.protocols[i]; */
/*         {
            ipAddress: '1.221.173.148',
            port: 4145,
            anonymityLevel: 'elite',
            protocols: [ 'socks4' ],
            country: 'kr',
            source: 'proxyscrape-com'
          }, */

/*     const ProxyStatus = enumUtils.createEnum([
['VALID', 'VALID'],
['NO_DATA', 'NO DATA'],
['MISSING_IP_ADDRESS', 'MISSING IP ADDRESS'],
['INVALID_IP_ADDRESS', 'INVALID IP ADDRESS'],
['MISSING_PORT', 'MISSING PORT'],
['INVALID_PORT', 'INVALID PORT'],
['MISSING_ANONYMITY_LEVEL', 'MISSING ANONYMITY_LEVEL'],
['INVALID_ANONYMITY_LEVEL', 'INVALID ANONYMITY_LEVEL'],
['MISSING_PROTOCOLS', 'MISSING PROTOCOLS'],
['INVALID_PROTOCOLS', 'INVALID PROTOCOLS'],
['MISSING_COUNTRY', 'MISSING COUNTRY'],
['INVALID_COUNTRY', 'INVALID COUNTRY'],
['MISSING_SOURCE', 'MISSING SOURCE']
]); */


/* const { validationUtils } = require('../utils'); */
/*     const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    if (!networkInterfaces) {
        return null;
    }
    const vEthernet = networkInterfaces['vEthernet (Default Switch)'];
    if (!validationUtils.isExists(vEthernet) || vEthernet.length !== 2) {
        return null;
    }
    const { address, netmask } = vEthernet[1];
    const t = {
        ipv4Address: address,
        subnetMask: netmask
    };
    console.log(t); */
/*     const response = await page.goto('https://api.ipify.org');
    const headers = response.headers();
    setTimeout(() => {
        console.log(response);
        //console.log(headers);
        browser.close();
    }, 3000); */
/* }); */

/*     {
    ipAddress: '96.82.74.129',
    port: 34032,
    anonymityLevel: 'elite',
    protocols: [ 'socks4' ],
    country: 'us',
    source: 'proxyscrape-com'
  },
  {
    ipAddress: '192.111.129.145',
    port: 16894,
    anonymityLevel: 'elite',
    protocols: [ 'socks4' ],
    country: 'us',
    source: 'proxyscrape-com'
  },
  {
    ipAddress: '24.172.34.114',
    port: 60133,
    anonymityLevel: 'elite',
    protocols: [ 'socks4' ],
    country: 'us',
    source: 'proxyscrape-com'
  },
  ... 5 more items
] */

/* const testPuppeteerWithProxy = async () => {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--proxy-server=socks4://177.154.55.114:51815']
    });
    const page = await browser.newPage();
    const cdpRequestDataRaw = await setupLoggingOfAllNetworkData(page);
    // Make requests.
    await page.goto('https://api.ipify.org');

    // Log captured request data.
    console.log(JSON.stringify(cdpRequestDataRaw, null, 2));
    setTimeout(() => {
        browser.close();
    }, 3000);
    // Returns map of request ID to raw CDP request data. This will be populated as requests are made.
    async function setupLoggingOfAllNetworkData(page1) {
        const cdpSession = await page1.target().createCDPSession();
        await cdpSession.send('Network.enable');
        const cdpRequestDataRaw1 = {};
        const addCDPRequestDataListener = (eventName) => {
            cdpSession.on(eventName, request => {
                cdpRequestDataRaw1[request.requestId] = cdpRequestDataRaw1[request.requestId] || {};
                Object.assign(cdpRequestDataRaw1[request.requestId], { [eventName]: request });
            });
        };
        addCDPRequestDataListener('Network.requestWillBeSent');
        addCDPRequestDataListener('Network.requestWillBeSentExtraInfo');
        addCDPRequestDataListener('Network.responseReceived');
        addCDPRequestDataListener('Network.responseReceivedExtraInfo');
        return cdpRequestDataRaw1;
    }
};

const getYourPublicIPAddress1 = () => {
    const http = require('http');
    var options = {
        host: 'ipv4bot.whatismyipaddress.com',
        port: 80,
        path: '/'
    };
    http.get(options, function (res) {
        console.log('status: ' + res.statusCode);

        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    }).on('error', function (e) {
        console.log('error: ' + e.message);
    });
};


const getYourPublicIPAddress2 = () => {
    var os = require('os');
    var networkInterfaces = os.networkInterfaces();
    console.log(networkInterfaces);
}

const verifyProxy = () => {


    const ProxyVerifier = require('proxy-verifier');
    const proxy = {
        ipAddress: '185.128.136.231',
        port: 3128,
        protocol: 'socks4'
    };

    ProxyVerifier.testAll(proxy, function (error, result) {
        if (error) {
            console.log(error);
            // Some unusual error occurred.
        } else {
            // The result object will contain success/error information.
            console.log(result);
        }
    });

};

const getProxiesList = () => {
    const ProxyLists = require('proxy-lists');
    ProxyLists.getProxies({
        // options
        countries: ['us', 'ca']
    })
        .on('data', function (proxies) {
            // Received some proxies.
            console.log('got some proxies');
            console.log(proxies);
        })
        .on('error', function (error) {
            // Some error has occurred.
            console.log('error!', error);
        })
        .once('end', function () {
            // Done getting proxies.
            console.log('end!');
        });
};

(async () => {
    await testPuppeteerWithProxy();
    getYourPublicIPAddress1();
    getYourPublicIPAddress2();
    verifyProxy();
    getProxiesList();
})(); */