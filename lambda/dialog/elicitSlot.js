/**
 * elicitSlot - For a given event, creates an 'elicit response' dialog action.
 *
 * @param event - The current event.
 * @param slotName - The slot name to elicit.
 * @param message - The message to send to the user (plain text).
 * @returns - The response.
 */
function elicitSlot(event, slotName, message) {
  //  Create the response.
  return {
    sessionAttributes: event.sessionAttributes,
    dialogAction: {
      type: 'ElicitSlot',
      intentName: event.currentIntent.name,
      slots: event.currentIntent.slots,
      slotToElicit: slotName,
      message: {
        contentType: 'PlainText',
        content: message
      },
      responseCard: null
    }
  };
}

module.exports = elicitSlot;
