const dialogActions = require('./utils/dialogActions');

const responses = {
  ThreeLaws: 'I only have the CPU to support two of the three laws at any one time.'
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
