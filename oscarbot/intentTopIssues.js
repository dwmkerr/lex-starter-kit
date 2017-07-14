const config = require('./config');
const dialogActions = require('./utils/dialogActions');
const login = require('./utils/github/login');
const query = require('./utils/github/query');
const i18n = require('./i18n');

function handler(event, context, callback) {
  const repository = event.sessionAttributes.Repository;
  const repoParts = repository.split('/');
  const owner = repoParts[0];
  const name = repoParts[1];

  const username = config.GITHUB_USERNAME;
  const password = config.GITHUB_PASSWORD;
  login(username, password, event)
    .then((token) => {
      console.log(`Logged in successfully, token: ${token}`);
      query(token, `
        query { 
          repository(owner: "${owner}", name: "${name}") {
            name
            issues(states: OPEN, first: 3, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                title,
                url
              }
            }
          }
        }
        `)
        .then((result) => {
          //  Create the response.
          const data = JSON.parse(result).data;
          const projectName = data.repository.name;
          const issues = data.repository.issues.nodes;
          const issueText = issues.reduce((a, b) => {
            return `${a} \n ${b.title} - ${b.url}`;
          }, '');
          const response = i18n('topIssuesResponse', {
            projectName,
            issueText
          });

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
