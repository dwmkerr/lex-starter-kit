const logging = require('./logging');
const intents = require('./intents');
const session = require('./session');

/**
 * Our main lambda handler function.
 *
 * @param event - details of the incoming event.
 * @param context - event context.
 * @param callback - callback to respond to the lambda function.
 * @returns {undefined}
 */
async function handler(event, context, callback) {

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

    //  If there slots we can load from the session, load them.
    session.loadSessionAttributesIntoSlots(event);

    //  Call the intent function.
    const dialogAction = await intentHandler(event, context);
    callback(null, dialogAction);
  } catch (err) {
    callback(err);
  }
}

module.exports = handler;
