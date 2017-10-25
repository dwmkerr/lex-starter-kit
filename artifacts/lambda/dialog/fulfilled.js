/**
 * fulfilled - Creates a 'fulfilled' dialog action.
 *
 * @param event - The current event.
 * @param message - The message to send to the user (plain text).
 * @returns - the 'fulfilled' dialog action.
 */
function fulfilled(event, message) {
  //  Create the response.
  return {
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
}

module.exports = fulfilled;
