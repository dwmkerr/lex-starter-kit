const config = require('../config');
const dialogActions = require('../utils/dialogActions');
const elicitSlot = require('../utils/dialog/elicitSlot');
const github = require('../utils/github');
const i18n = require('../i18n');

function handler(event, context, callback) {
  const gitHubUsername = event.currentIntent.slots.GitHubUsername;

  //  Elicit the required slots.
  if (!gitHubUsername) return elicitSlot(event, 'GitHubUsername', i18n('elicitSlotGitHubUser'), callback);

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      github.query(token, `
        query {
          user(login: "${gitHubUsername}") {
            issues(orderBy: {
              field: UPDATED_AT,
              direction: DESC
            }, first: 5, states: OPEN) {
              nodes {
                title,
                url
              }
            }
          }
        }`)
        .then((result) => {

          const data = JSON.parse(result).data;
          const issues = data.user.issues.nodes;
          const issueText = issues.reduce((a, b) => {
            return `${a} \n _${b.title}_ - ${b.url}`;
          }, '');
          const response = i18n('myOpenIssuesResponse', {
            issueText
          });

          return callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
            contentType: 'PlainText',
            content: response
          }));
        });
    });
}

module.exports = {
  handler
};
