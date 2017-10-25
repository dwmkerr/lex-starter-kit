/**
 * creates a lex event, used for testin.
 *
 * @param options for the event. Allowed (* = required):
 *   - intent
 *   - slots
 *   - confirmationStatus
 *   - sessionAttributes
 * @returns {undefined}
 */
function createEvent(options) {
  //  Sanity check the input.
  if (!options) throw new Error('\'options\' is required');
  if (!options.intent) throw new Error('\'options.intent\' is required');

  //  Create the event object from the options.
  return {
    currentIntent: {
      slots: Object.assign({}, options.slots), // make sure we've always got an object, even if it is empty.
      name: options.intent,
      confirmationStatus: options.confirmationStatus || 'None'
    },
    bot: {
      alias: '$LATEST',
      version: '$LATEST',
      name: 'lex-starter-kit'
    },
    userId: 'Dave',
    invocationSource: 'DialogCodeHook',
    outputDialogMode: 'Test',
    messageVersion: '1.0',
    sessionAttributes: Object.assign({}, options.sessionAttributes)
  };
}

module.exports = createEvent;
