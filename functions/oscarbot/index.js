const validateSession = require('./validateSession');
const intentGetStars = require('./intentGetStars');
const intentOpenIssue = require('./intentOpenIssue');

const INTENT_HANDLERS = {
  GetStars: intentGetStars,
  OpenIssue: intentOpenIssue
};

function handler(event, context, callback) {
  //  Validate the event. This will elicit session variables as needed.
  if (!validateSession(event, context, callback)) return;

  const intentName = event.currentIntent.name;
  const intentHandler = INTENT_HANDLERS[intentName];

  if (!intentHandler) {
    throw new Error('Intent name not recognised');
  }

  intentHandler.handler(event, context, callback);
}

module.exports = {
  handler
};
