const validateSession = require('./validateSession');
const snappyResponse = require('./snappyResponse');
const intentCountIssues = require('./intentCountIssues');
const intentDescribeLastCommit = require('./intentDescribeLastCommit');
const intentGetStars = require('./intentGetStars');
const intentOpenIssue = require('./intentOpenIssue');

const INTENT_HANDLERS = {
  CountIssues: intentCountIssues,
  DescribeLastCommit: intentDescribeLastCommit,
  GetStars: intentGetStars,
  OpenIssue: intentOpenIssue
};

function handler(event, context, callback) {
  //  If we can reply with a snappy response, we are done.
  if (snappyResponse(event, context, callback)) return;

  //  Validate the event. This will elicit session variables as needed.
  validateSession(event, context, callback)
    .then((valid) => {
      //  If the session is not valid, the callback will have been called
      //  already to elicit input, so we are done.
      if (!valid) return;

      const intentName = event.currentIntent.name;
      const intentHandler = INTENT_HANDLERS[intentName];

      if (!intentHandler) {
        throw new Error('Intent name not recognised');
      }

      intentHandler.handler(event, context, callback);
    });
}

module.exports = {
  handler
};
