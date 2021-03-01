const errorScript = require('./error.script');
require('../services/files/initiate.service').initiate('purchase');
const PurchaseLogic = require('../logics/purchase.logic');

(async () => {
    await new PurchaseLogic().run(null);
})().catch(e => errorScript.handleScriptError(e, 1));