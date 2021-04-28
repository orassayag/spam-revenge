const enumUtils = require('../enum.utils');

const EnvironmentEnum = enumUtils.createEnum([
    ['PRODUCTION', 'PRODUCTION'],
    ['DEVELOPMENT', 'DEVELOPMENT']
]);

const MethodEnum = enumUtils.createEnum([
    ['STANDARD', 'STANDARD'],
    ['RANDOM', 'RANDOM']
]);

const ModeEnum = enumUtils.createEnum([
    ['STANDARD', 'STANDARD'],
    ['SILENT', 'SILENT']
]);

const ScriptTypeEnum = enumUtils.createEnum([
    ['INITIATE', 'initiate'],
    ['BACKUP', 'backup'],
    ['SUBSCRIBE', 'subscribe'],
    ['TEST', 'test']
]);

const StatusEnum = enumUtils.createEnum([
    ['ABORT_BY_THE_USER', 'ABORT BY THE USER'],
    ['INITIATE', 'INITIATE'],
    ['VALIDATE', 'VALIDATE'],
    ['INITIATE_LOCAL_DATA', 'INITIATE LOCAL DATA'],
    ['INITIATE_EMAIL_ADDRESSES', 'INITIATE EMAIL ADDRESSES'],
    ['INITIATE_SUBSCRIBE_LIST', 'INITIATE SUBSCRIBE LIST'],
    ['SEARCH_PROXY', 'SEARCH PROXY'],
    ['NO_PROXY_FOUND', 'NO PROXY FOUND'],
    ['ERROR_IN_A_ROW', 'ERROR IN A ROW'],
    ['LIMIT_EXCEEDED', 'LIMIT EXCEEDED'],
    ['PAUSE', 'PAUSE'],
    ['FINISH', 'FINISH']
]);

module.exports = { EnvironmentEnum, MethodEnum, ModeEnum, ScriptTypeEnum, StatusEnum };