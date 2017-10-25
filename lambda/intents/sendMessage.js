const dialog = require('../dialog');
const config = require('../config');

function lookup(recipient) {
  const phoneBook = {
    'sarah': '+62 123'
  };
  return phoneBook[recipient.toLower()];
}

function send(phoneNumber, message) {
  if (!config.twilioKey) throw new Error('A twilio key is required');
  //  TODO twilio
}

function sendMessage(event, context) {
  const recipient = event.currentIntent.slots.Recipient;
  const message = event.currentIntent.slots.Message;

  if (!recipient) return dialog.elicitSlot(event, 'Recipient', 'Who should I send the message to?');
  if (!message) return dialog.elicitSlot(event, 'Message', 'What message should I send?');

  //  Look up the phone number from the name.
  const phoneNumber = lookup(recipient);

  //  If we don't have the phone number, fail.
  if (!phoneNumber) return dialog.failed(event, `Sorry, I don't have a phone number for ${recipient}.`);

  //  Send the message.
  //  Note: you could handle the error here if you like and return a nice message.
  return send(phoneNumber, message)
    .then(() => dialog.fulfilled(event, `I sent the message '${message}' to ${recipient} for you :)`));
}

module.exports = sendMessage;
