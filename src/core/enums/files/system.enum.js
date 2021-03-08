const enumUtils = require('../enum.utils');

const Environment = enumUtils.createEnum([
    ['PRODUCTION', 'PRODUCTION'],
    ['DEVELOPMENT', 'DEVELOPMENT']
]);

const Method = enumUtils.createEnum([
    ['STANDARD', 'STANDARD'],
    ['RANDOM', 'RANDOM']
]);

const Mode = enumUtils.createEnum([
    ['STANDARD', 'STANDARD'],
    ['SILENT', 'SILENT']
]);

const ScriptType = enumUtils.createEnum([
    ['BACKUP', 'backup'],
    ['SUBSCRIBE', 'subscribe'],
    ['TEST', 'test']
]);

const Status = enumUtils.createEnum([
    ['ABORT_BY_THE_USER', 'ABORT BY THE USER'],
    ['INITIATE', 'INITIATE'],
    ['VALIDATE', 'VALIDATE'],
    ['INITIATE_LOCAL_DATA', 'INITIATE LOCAL DATA'],
    ['INITIATE_EMAIL_ADDRESSES', 'INITIATE EMAIL ADDRESSES'],
    ['INITIATE_SUBSCRIBE_LIST', 'INITIATE SUBSCRIBE LIST'],
    ['SEARCH_PROXY', 'SEARCH PROXY'],
    ['ERROR_IN_A_ROW', 'ERROR IN A ROW'],
    ['LIMIT_EXCEEDED', 'LIMIT EXCEEDED'],
    ['PAUSE', 'PAUSE'],
    ['FINISH', 'FINISH']
]);

module.exports = { Environment, Method, Mode, ScriptType, Status };