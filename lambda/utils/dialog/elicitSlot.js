
/**
 * elicitSlot - For a given event, fires the callback to elicit a slot.
 *
 * @param event - The current event.
 * @param slotName - The slot name to elicit.
 * @param message - The message to send to the user (plain text).
 * @param callback - The lambda callback.
 * @returns - The synchronous result of the callback function.
 */
function elicitSlot(event, slotName, message, callback) {
  //  Create the response.
  const response = {
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

  return callback(null, response);
}

module.exports = elicitSlot;
