class TextUtils {

    constructor() { }

    replaceCharacter(text, targetCharacter, replaceCharecter) {
        const regex = new RegExp(targetCharacter, 'g');
        return text.replace(regex, replaceCharecter);
    }
}

module.exports = new TextUtils();