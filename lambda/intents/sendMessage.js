const twilio = require('twilio');
const dialog = require('../dialog');
const config = require('../config');

function send(recipient, message) {
  //  Grab our twilio config.
  const { twilio: { sid, authToken, phoneNumber } } = config;

  //  Validate the config is present.
  if (!sid) throw new Error('No Twilio SID has been configured');
  if (!authToken) throw new Error('No Twilio Auth Token has been configured');
  if (!phoneNumber) throw new Error('No Twilio Phone Number has been configured');

  //  Create the twilio client and send the message.
  const client = new twilio(sid, authToken);
  return client.messages.create({
    body: message,
    to: recipient,
    from: phoneNumber
  });
}

function sendMessage(event) {
  //  Grab the data from the slots.
  const recipient = event.currentIntent.slots.Recipient;
  const message = event.currentIntent.slots.Message;

  //  Elicit any missing slots.
  if (!recipient) return Promise.resolve(dialog.elicitSlot(event, 'Recipient', 'Who should I send the message to?'));
  if (!message) return Promise.resolve(dialog.elicitSlot(event, 'Message', 'What message should I send?'));

  //  Send the message.
  return send(recipient, message)
    .then(() => dialog.fulfilled(event, `I sent the message '${message}' to ${recipient} for you :)`))
    .catch((err) => {
      console.error(`Failed to send '${message}' to '${recipient}'`);
      console.error(err);
      return dialog.failed(event, `Sorry, I couldn't send the message. Maybe ${recipient} is not a valid phone number?`);
    });
}

module.exports = sendMessage;
