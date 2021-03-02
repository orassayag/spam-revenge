const errorScript = require('./error.script');
require('../services/files/initiate.service').initiate('subscribe');
const SubscribeLogic = require('../logics/subscribe.logic');

(async () => {
    await new SubscribeLogic().run(null);
})().catch(e => errorScript.handleScriptError(e, 1));