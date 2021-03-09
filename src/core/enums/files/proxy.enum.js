const enumUtils = require('../enum.utils');

const ProxyAnonymityLevel = enumUtils.createEnum([
    ['transparent', 'transparent'],
    ['anonymous', 'anonymous'],
    ['elite', 'elite']
]);

const ProxyProtocol = enumUtils.createEnum([
    ['HTTP', 'http'],
    ['HTTPS', 'https'],
    ['SOCKS4', 'socks4'],
    ['SOCKS5', 'socks5']
]);

const ProxyStatus = enumUtils.createEnum([
    ['CREATE', 'CREATE'],
    ['VALID', 'VALID'],
    ['NO_DATA', 'NO DATA'],
    ['MISSING_IP_ADDRESS', 'MISSING IP ADDRESS'],
    ['INVALID_IP_ADDRESS', 'INVALID IP ADDRESS'],
    ['MISSING_PORT', 'MISSING PORT'],
    ['INVALID_PORT', 'INVALID PORT'],
    ['MISSING_ANONYMITY_LEVEL', 'MISSING ANONYMITY LEVEL'],
    ['INVALID_ANONYMITY_LEVEL', 'INVALID ANONYMITY LEVEL'],
    ['MISSING_PROTOCOLS', 'MISSING PROTOCOLS'],
    ['INVALID_PROTOCOLS', 'INVALID PROTOCOLS'],
    ['MISSING_COUNTRY', 'MISSING COUNTRY'],
    ['INVALID_COUNTRY', 'INVALID COUNTRY'],
    ['MISSING_SOURCE', 'MISSING SOURCE']
]);

module.exports = { ProxyAnonymityLevel, ProxyProtocol, ProxyStatus };
/*         {
            ipAddress: '1.221.173.148',
            port: 4145,
            anonymityLevel: 'elite',
            protocols: [ 'socks4' ],
            country: 'kr',
            source: 'proxyscrape-com'
          }, */