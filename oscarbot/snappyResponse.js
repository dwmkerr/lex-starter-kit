const dialog = require('./utils/dialog');
const i18n = require('./i18n');

const responses = {
  AreYouMarried: i18n('areYouMarried'),
  Hi: i18n('hi'),
  HowsItGoing: i18n('howsItGoing'),
  IveGotAProblem: i18n('iveGotAProblem'),
  SpacesOrTabs: i18n('spacesOrTabs'),
  TellMeAJoke: i18n('tellMeAJoke'),
  ThreeLaws: i18n('threeLaws'),
  WhatsUp: i18n('whatsUp'),
  WhatsYourFavouriteMovie: i18n('whatsYourFavouriteMovie'),
  WhyIsYourNameOscar: i18n('whyIsYourNameOscar'),
  WhyWereYouCreated: i18n('whyWereYouCreated')
};

function snappyResponse(event, context, callback) {

  //  See if we've got a response.
  const response = responses[event.currentIntent.name];

  //  If we've got no response, return false and we're done.
  if (!response) return false;

  //  Fire off a snappy response.
  dialog.fulfilled(event, response, callback);

  //  True. We were indeed snappy.
  return true;
}

module.exports = snappyResponse;
