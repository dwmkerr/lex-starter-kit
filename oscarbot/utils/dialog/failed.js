
/**
 * failed - Fires a 'failed' response.
 *
 * @param event - The current event.
 * @param message - The message to send to the user (plain text).
 * @param callback - The lambda callback.
 * @returns - The synchronous result of the callback function.
 */
function failed(event, message, callback) {
  //  Create the response.
  const response = {
    sessionAttributes: event.sessionAttributes,
    dialogAction: {
      type: 'Failed',
      intentName: event.currentIntent.name,
      slots: event.currentIntent.slots,
      message: {
        contentType: 'PlainText',
        content: message
      },
      responseCard: null
    }
  };

  return callback(null, response);
}

module.exports = failed;
