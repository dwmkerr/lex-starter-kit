function createTestInput(options) {
  return {
    currentIntent: {
      slots: options.slots,
      name: options.intent,
      confirmationStatus: 'None'
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
    sessionAttributes: options.sessionAttributes
  };
}

module.exports = createTestInput;
