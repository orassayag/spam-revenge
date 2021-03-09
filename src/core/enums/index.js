const { Placeholder } = require('./files/placeholder.enum');
const { ProxyAnonymityLevel, ProxyProtocol, ProxyStatus } = require('./files/proxy.enum');
const { SubscribeStatus, SubscribeStatusLog } = require('./files/subscribe.enum');
const { Environment, Method, Mode, ScriptType, Status } = require('./files/system.enum');
const { StatusIcon, Color, ColorCode } = require('./files/text.enum');

module.exports = {
    Color, ColorCode, Environment, Method, Mode, ProxyAnonymityLevel, ProxyProtocol, ProxyStatus,
    Placeholder, ScriptType, Status, StatusIcon, SubscribeStatus, SubscribeStatusLog
};

/* const { CourseStatus, CourseStatusLog, CourseType } = require('./files/course.enum');
const { Placeholder } = require('./files/placeholder.enum');
const { CoursesDatesType, Environment, Method, Mode, ScriptType, Status } = require('./files/system.enum');
const { StatusIcon, Color, ColorCode } = require('./files/text.enum');

module.exports = {
    Color, ColorCode, CourseStatus, CourseStatusLog, CourseType, CoursesDatesType,
    Environment, Method, Mode, Placeholder, ScriptType, Status, StatusIcon
}; */