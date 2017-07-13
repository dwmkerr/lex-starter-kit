const config = require('./config');
const dialogActions = require('./utils/dialogActions');
const github = require('./utils/github');
const i18n = require('./i18n');

function elicitSlot(event, slotName, message, callback) {
  return callback(null,
    dialogActions.elicitSlot(event.sessionAttributes, 
      event.currentIntent.name, event.currentIntent.slots, slotName, { contentType: 'PlainText', content: message } ));
}

function checkConfirmationStatus(event, callback) {
  const confirmationStatus = event.currentIntent.confirmationStatus;
  if (confirmationStatus === 'Denied') {
    return callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
      contentType: 'PlainText',
      content: 'Ok, I will not create the issue.'
    }));
  } else if (confirmationStatus === 'None') {
    const issueTitle = event.currentIntent.slots.IssueTitle;
    const issueContent = event.currentIntent.slots.IssueContent;

    return callback(null, dialogActions.confirmIntent(event.sessionAttributes,
      event.currentIntent.name,
      event.currentIntent.slots,
      {
        contentType: 'PlainText',
        content: i18n('openIssueConfirm', {
          issueTitle,
          issueContent
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
  const issueTitle = event.currentIntent.slots.IssueTitle;
  const issueContent = event.currentIntent.slots.IssueContent;

  if (!issueTitle) return elicitSlot(event, 'IssueTitle', i18n('openIssueRequestTitle'), callback);
  if (!issueContent) return elicitSlot(event, 'IssueContent', i18n('openIssueRequestDescription', { issueTitle }), callback);

  if (checkConfirmationStatus(event, callback)) return;

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      github.post(token, `/repos/${repository}/issues`, {
        title: issueTitle,
        body: issueContent
      })
        .then((result) => {

          //  Create the response.
          console.log(`Result is: ${result}`);
          const url = result.html_url;
          const response = i18n('openIssueResponse', { url });

          callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
            contentType: 'PlainText',
            content: response
          }));
        });
    });
}

module.exports = {
  handler
};
