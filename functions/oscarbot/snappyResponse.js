const dialogActions = require('./utils/dialogActions');
const i18n = require('./i18n');

const responses = {
  ThreeLaws: i18n('threeLaws')
};

function snappyResponse(event, context, callback) {

  //  See if we've got a response.
  const response = responses[event.currentIntent.name];
  
  //  If we've got no response, return false and we're done.
  if (!response) return false;

  //  Fire off a snappy response.
  callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
    contentType: 'PlainText',
    content: response
  }));

  //  True. We were indeed snappy.
  return true;
}

module.exports = snappyResponse;
