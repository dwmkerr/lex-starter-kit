const logging = require('./logging');
const intents = require('./intents');

/**
 * Our main lambda handler function.
 *
 * @param event - details of the incoming event.
 * @param context - event context.
 * @param callback - callback to respond to the lambda function.
 * @returns {undefined}
 */
function handler(event, context, callback) {

  //  Make sure if we throw anything, we will properly call the callback,
  try {
    //  Log the incoming event, and ensure we log the response in the callback.
    logging.logIncomingEvent(event);
    callback = logging.wrapCallback(callback);

    //  Get the name of the intent, find the appropriate intent function.
    const intentName = event.currentIntent.name;
    const intentHandler = intents[intentName];

    //  If there is no function for the, bail.
    if (!intentHandler) {
      throw new Error(`Intent '${intentName}' not recognised`);
    }
    
    //  Call the intent function.
    //  Bonus: If we don't get a promise, auto-promisify? Or throw?
    intentHandler(event, context)
      .then(dialogAction => callback(null, dialogAction))
      .catch(callback);
  } catch (err) {
    callback(err);
  }
}

module.exports = handler;
