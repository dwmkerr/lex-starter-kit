const dialog = require('./utils/dialog');
const i18n = require('./i18n');

const responses = {
  ThreeLaws: i18n('threeLaws'),
  HowsItGoing: i18n('howsItGoing')
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
