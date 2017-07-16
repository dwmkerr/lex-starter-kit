const dialogActions = require('../utils/dialogActions');
const elicitSlot = require('../utils/dialog/elicitSlot');
const failed = require('../utils/dialog/failed');
const github = require('../utils/github');
const i18n = require('../i18n');

function checkConfirmationStatus(event, callback) {
  const confirmationStatus = event.currentIntent.confirmationStatus;
  if (confirmationStatus === 'Denied') {
    return callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
      contentType: 'PlainText',
      content: 'Ok, I will not unstar the repository.'
    }));
  } else if (confirmationStatus === 'None') {
    const repository = event.currentIntent.slots.Repository;
    const username = event.currentIntent.slots.GitHubUsername;

    return callback(null, dialogActions.confirmIntent(event.sessionAttributes,
      event.currentIntent.name,
      event.currentIntent.slots,
      {
        contentType: 'PlainText',
        content: i18n('unstarProjectConfirm', {
          repository,
          username
        })
      },
      dialogActions.buildResponseCard('Confirm', null, [{
        text: 'Yes',
        value: 'Yes'
      }, {
        text: 'No',
        value: 'No'
      }])));
  }
}

function handler(event, context, callback) {
  const repository = event.sessionAttributes.Repository;
  const gitHubUsername = event.currentIntent.slots.GitHubUsername;
  const gitHubPassword = event.currentIntent.slots.GitHubPassword;

  //  Elicit the slots if needed.
  if (!gitHubUsername) return elicitSlot(event, 'GitHubUsername', i18n('unstarProjectRequestUsername'), callback);
  if (!gitHubPassword) return elicitSlot(event, 'GitHubPassword', i18n('unstarProjectRequestPassword'), callback);

  //  We'll confirm for this event.
  if (checkConfirmationStatus(event, callback)) return;

  //  OK, time to try and login - as the user who will unstar (not as oscar)!
  github.login(gitHubUsername, gitHubPassword)
    .then((token) => {
      return github.del(token, `/user/starred/${repository}`);
    })
    .then((result) => {

      //  Check the result.
      if (result.statusCode !== 204) {
        //  Time to bail...
      }

      //  Create the response.
      const response = i18n('unstarProjectSuccessResponse', { repository });

      callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
        contentType: 'PlainText',
        content: response
      }));
    })
    .catch((err) => {
      console.log(`Error unstarring project: ${err}`);
      failed(event, 'Sorry, there was a problem unstarring the project.', callback);
    });
}

module.exports = {
  handler
};
