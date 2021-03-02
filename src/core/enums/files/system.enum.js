const enumUtils = require('../enum.utils');

const Environment = enumUtils.createEnum([
    ['PRODUCTION', 'PRODUCTION'],
    ['DEVELOPMENT', 'DEVELOPMENT']
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
    ['VALIDATION', 'VALIDATION'],
    ['LIMIT_EXCEEDED', 'LIMIT EXCEEDED'],
    ['PAUSE', 'PAUSE'],
    ['FINISH', 'FINISH']
]);

module.exports = { Environment, Mode, ScriptType, Status };