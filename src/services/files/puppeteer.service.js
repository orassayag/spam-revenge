const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const { ResponseDataModel } = require('../../core/models');
const applicationService = require('./application.service');

class PuppeteerService {

    constructor() {
        this.pageOptions = null;
        this.waitForFunction = null;
    }

    initiate() {
        puppeteerExtra.use(pluginStealth());
        this.pageOptions = {
            waitUntil: 'networkidle2',
            timeout: this.timeout
        };
        this.waitForFunction = 'document.querySelector("body")';
    }

    async getResponseData(data) {
        const responseDataModel = new ResponseDataModel();
        let browser = null;
        try {
            browser = await puppeteerExtra.launch({
                headless: false,
                args: [this.createProxyArgument(data)]
            });
            const page = await browser.newPage();
            const pages = await browser.pages();
            if (pages.length > 1) {
                await pages[0].close();
            }
            // Make a request to get the public IP address.
            await page.goto(applicationService.applicationDataModel.publicIPAddressURL, this.pageOptions);
            responseDataModel.publicIPAddress = await page.$eval('pre', pre => pre.innerText);
            if (data) {
                await page.setRequestInterception(true);
                await page.setDefaultNavigationTimeout(0);
                page.on('request', (request) => {
                    if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                        request.abort();
                    } else {
                        request.continue();
                    }
                });
                await page.goto('https://www.touristisrael.com/newsletter/', this.pageOptions);
                const html = await page.content();
                console.log(html);
            }
            await browser.close();
        }
        catch (error) {
            // ToDo: Remove this.
            console.log(error);
            await browser.close();
        }
        return responseDataModel;
    }

    // Returns map of request Id to raw CDP request data. This will be populated as requests are made.
    async setupLoggingOfAllNetworkData(page1) {
        await page1.setRequestInterception(true);
        const cdpSession = await page1.target().createCDPSession();
        await cdpSession.send('Network.enable');
        const cdpRequestDataRaw1 = {};
        const addCDPRequestDataListener = (eventName) => {
            cdpSession.on(eventName, request => {
                console.log(request);
            });
        };
        addCDPRequestDataListener('Network.requestWillBeSent');
        addCDPRequestDataListener('Network.requestWillBeSentExtraInfo');
        addCDPRequestDataListener('Network.responseReceived');
        addCDPRequestDataListener('Network.responseReceivedExtraInfo');
        return cdpRequestDataRaw1;
    }

    createProxyArgument(data) {
        if (!data) {
            return '';
        }
        console.log(`--proxy-server=socks4://183.87.39.174:40252`);
        return `--proxy-server=socks4://183.87.39.174:40252`;
    }
}

module.exports = new PuppeteerService();