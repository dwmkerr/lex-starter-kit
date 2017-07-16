/**
 * fulfilled - Fires a 'fulfilled' response.
 *
 * @param event - The current event.
 * @param message - The message to send to the user (plain text).
 * @param callback - The lambda callback.
 * @returns - The synchronous result of the callback function.
 */
function fulfilled(event, message, callback) {

  //  Create the response.
  const response = {
    sessionAttributes: event.sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState: 'Fulfilled',
      message: {
        contentType: 'PlainText',
        content: message
      },
      responseCard: null
    }
  };

  return callback(null, response);
}

module.exports = fulfilled;
