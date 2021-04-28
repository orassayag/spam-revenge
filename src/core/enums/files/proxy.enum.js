const enumUtils = require('../enum.utils');

const ProxyAnonymityLevelEnum = enumUtils.createEnum([
    ['transparent', 'transparent'],
    ['anonymous', 'anonymous'],
    ['elite', 'elite']
]);

const ProxyProtocolEnum = enumUtils.createEnum([
    ['HTTP', 'http'],
    ['HTTPS', 'https'],
    ['SOCKS4', 'socks4'],
    ['SOCKS5', 'socks5']
]);

const ProxyStatusEnum = enumUtils.createEnum([
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

module.exports = { ProxyAnonymityLevelEnum, ProxyProtocolEnum, ProxyStatusEnum };