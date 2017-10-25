
/**
 * failed - Builds a 'failed' dialog action.
 *
 * @param event - The current event.
 * @param message - The message to send to the user (plain text).
 * @returns - The 'failed' dialog action.
 */
function failed(event, message) {
  //  Create and return the response.
  return {
    sessionAttributes: event.sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState: 'Failed',
      intentName: event.currentIntent.name,
      slots: event.currentIntent.slots,
      message: {
        contentType: 'PlainText',
        content: message
      },
      responseCard: null
    }
  };
}

module.exports = failed;
