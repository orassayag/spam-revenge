class AccountData {

    constructor(settings) {
        const { ACCOUNT_FILE_PATH } = settings;
        this.accountFilePath = ACCOUNT_FILE_PATH;
        this.email = null;
        this.password = null;
        this.asterixsPassword = null;
    }
}

module.exports = AccountData;