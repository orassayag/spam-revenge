const enumUtils = require('../enum.utils');
const textUtils = require('../text.utils');

const SubscribeStatusEnum = enumUtils.createEnum([
    ['CREATE', 'create'],
    ['SUBSCRIBE', 'subscribe'],
    ['FAIL', 'fail'],
    ['NO_DATA', 'noData'],
    ['MISSING_URL', 'missingURL'],
    ['INVALID_URL', 'invalidURL'],
    ['MISSING_TEXTBOX_FIELD', 'missingTextBoxField'],
    ['MISSING_TEXTBOX_VALUE', 'missingTextBoxValue'],
    ['MISSING_BUTTON_FIELD', 'missingButtonField'],
    ['MISSING_BUTTON_VALUE', 'missingButtonValue'],
    ['MISSING_FIELD', 'missingField'],
    ['UNEXPECTED_FIELD', 'unexpectedField'],
    ['URL_NOT_FOUND', 'urlNotFound'],
    ['TEXTBOX_NOT_FOUND', 'textBoxNotFound'],
    ['BUTTON_NOT_FOUND', 'buttonNotFound'],
    ['DUPLICATE', 'duplicate'],
    ['IGNORE', 'ignore']
]);

const SubscribeStatusLogEnum = enumUtils.createEnum(Object.keys(SubscribeStatusEnum).map(k => {
    return [SubscribeStatusEnum[k], textUtils.replaceCharacter(k, '_', ' ')];
}));

module.exports = { SubscribeStatusEnum, SubscribeStatusLogEnum };