const enumUtils = require('../enum.utils');
const textUtils = require('../text.utils');

const SubscribeStatus = enumUtils.createEnum([
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

const SubscribeStatusLog = enumUtils.createEnum(Object.keys(SubscribeStatus).map(k => {
    return [SubscribeStatus[k], textUtils.replaceCharacter(k, '_', ' ')];
}));

module.exports = { SubscribeStatus, SubscribeStatusLog };
/* const SubscribeStatus = enumUtils.createEnum([
    ['CREATE', 'create'],
    ['SUBSCRIBE', 'subscribe'],
    ['FAIL', 'fail'],
    ['MISSING_FIELD', 'missingField'],
    ['UNEXPECTED_FIELD', 'unexpectedField'],
    ['NO_DATA', 'noData'],
    ['MISSING_URL', 'missingURL'],
    ['EMPTY_URL', 'emptyURL'],
    ['INVALID_URL', 'invalidURL'],
    ['MISSING_TEXTBOX_FIELD', 'missingTextBoxField'],
    ['EMPTY_TEXTBOX_FIELD', 'emptyTextBoxField'],
    ['MISSING_TEXTBOX_VALUE', 'missingTextBoxValue'],
    ['EMPTY_TEXTBOX_VALUE', 'emptyTextBoxValue'],
    ['MISSING_BUTTON_FIELD', 'missingButtonField'],
    ['EMPTY_BUTTON_FIELD', 'emptyButtonField'],
    ['MISSING_BUTTON_VALUE', 'missingButtonValue'],
    ['EMPTY_BUTTON_VALUE', 'emptyButtonValue'],
    ['URL_NOT_FOUND', 'urlNotFound'],
    ['TEXTBOX_NOT_FOUND', 'textBoxNotFound'],
    ['BUTTON_NOT_FOUND', 'buttonNotFound'],
    ['DUPLICATE', 'duplicate']
]); */

/* MISSING_URL/EMPTY_URL/INVALID_URL/MISSING_TEXTBOX_FIELD/EMPTY_TEXTBOX_FIELD/MISSING_TEXTBOX_VALUE/EMPTY_TEXTBOX_VALUE
MISSING_BUTTON_FIELD/EMPTY_BUTTON_FIELD/MISSING_BUTTON_VALUE/EMPTY_BUTTON_VALUE/URL_NOT_FOUND/TEXTBOX_NOT_FOUND
BUTTON_NOT_FOUND */