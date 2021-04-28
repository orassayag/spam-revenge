const { PlaceholderEnum } = require('./files/placeholder.enum');
const { ProxyAnonymityLevelEnum, ProxyProtocolEnum, ProxyStatusEnum } = require('./files/proxy.enum');
const { SubscribeStatusEnum, SubscribeStatusLogEnum } = require('./files/subscribe.enum');
const { EnvironmentEnum, MethodEnum, ModeEnum, ScriptTypeEnum, StatusEnum } = require('./files/system.enum');
const { StatusIconEnum, ColorEnum, ColorCodeEnum } = require('./files/text.enum');

module.exports = {
    ColorEnum, ColorCodeEnum, EnvironmentEnum, MethodEnum, ModeEnum, ProxyAnonymityLevelEnum, ProxyProtocolEnum, ProxyStatusEnum,
    PlaceholderEnum, ScriptTypeEnum, StatusEnum, StatusIconEnum, SubscribeStatusEnum, SubscribeStatusLogEnum
};