const config = require('./config');
const dialogActions = require('./utils/dialogActions');
const github = require('./utils/github');

function elicitSlot(event, slotName, message, callback) {
	return callback(null,
      dialogActions.elicitSlot(event.sessionAttributes, 
        event.currentIntent.name, event.currentIntent.slots, slotName, message));
}

function handler(event, context, callback) {
	const issueTitle = event.currentIntent.slots.IssueTitle;
	const issueContent = event.currentIntent.slots.IssueContent;

    if (!issueTitle) return elicitSlot(event, 'IssueTitle', 'Can you give a me a title for the issue?', callback);
    if (!issueContent) return elicitSlot(event, 'IssueContent', 'Can you give a me a description for the issue', callback);

    github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD)
      .then((token) => {
        github.post(token, `/repos/mindmelting/lex-boilerplate/issues`, {
          title: issueTitle,
          body: issueContent
        })
        .then((result) => {

          //  Create the response.
          console.log(`Result is: ${result}`);
          const url = result.url;
          const response = `I opened the issue for you, it's at ${url}`;

          callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
            contentType: 'PlainText',
            content: response
          }));
        });
      });
};

module.exports = {
  handler
};
