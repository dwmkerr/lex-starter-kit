const dialog = require('../utils/dialog');
const i18n = require('../i18n');
const utterances = require('./utterances.json');

function handler(event, context, callback) {
  //  Load all of the utterances Oscar can handle.
  const utterancesList = utterances.map(u => ` - ${u}`).join('\n');
  const response = i18n('whatCanIAskYouResponse', { utterancesList });

  return dialog.fulfilled(event, response, callback);
}

module.exports = {
  handler
};
