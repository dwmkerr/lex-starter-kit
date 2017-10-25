function createTestInput(options) {
  return {
    currentIntent: {
      slots: Object.assign({}, options.slots), // make sure we've always got an object, even if it is empty.
      name: options.intent,
      confirmationStatus: options.confirmationStatus || 'None'
    },
    bot: {
      alias: '$LATEST',
      version: '$LATEST',
      name: 'OscarBot'
    },
    userId: 'Dave',
    invocationSource: 'DialogCodeHook',
    outputDialogMode: 'Test',
    messageVersion: '1.0',
    sessionAttributes: Object.assign({}, options.sessionAttributes)
  };
}

module.exports = createTestInput;
