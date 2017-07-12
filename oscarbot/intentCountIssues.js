const config = require('./config');
const dialogActions = require('./utils/dialogActions');
const login = require('./utils/github/login');
const query = require('./utils/github/query');

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
            issues(states: OPEN) { totalCount }
          }
        }
        `)
        .then((result) => {

          //  Create the response.
          const data = JSON.parse(result).data;
          const projectName = data.repository.name;
          const issues = data.repository.issues.totalCount;
          const response = `${projectName} has ${issues} open issues`;

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
