const dialog = require('../utils/dialog');
const i18n = require('../i18n');

function handler(event, context, callback) {
  //  Before we return the response, blat the session.
  event.sessionAttributes = {};

  const response = i18n('goodbye');
  return dialog.fulfilled(event, response, callback);
}

module.exports = {
  handler
};
