const logging = require('./logging');
const validateSession = require('./validateSession');
const snappyResponse = require('./snappyResponse');
const intents = require('./intents');

const INTENT_HANDLERS = {
  CountIssues: intents.countIssues,
  CountOpenPRs: intents.countOpenPRs,
  DescribeLastCommit: intents.describeLastCommit,
  GetForks: intents.getForks,
  GetStars: intents.getStars,
  Goodbye: intents.goodbye,
  HowManyContributors: intents.howManyContributors,
  OpenIssue: intents.openIssue,
  TopIssues: intents.topIssues,
  WhatAreMyMostPopularProjects: intents.whatAreMyMostPopularProjects,
  StarProject: intents.starProject,
  UnstarProject: intents.unstarProject,
  WhatCanIAskYou: intents.whatCanIAskYou,
  WhatProjectsAmIWorkingOn: intents.whatProjectsAmIWorkingOn,
  WhatsTrending: intents.whatsTrending,
  MyOpenIssues: intents.myOpenIssues,
  ForkProject: intents.forkProject
};

function handler(event, context, callback) {

  //  Log the incoming event, and ensure we log the response in the callback.
  logging.logIncomingEvent(event);
  callback = logging.wrapCallback(callback);

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
