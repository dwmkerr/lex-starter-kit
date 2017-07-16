const config = require('../config');
const dialogActions = require('../utils/dialogActions');
const login = require('../utils/github/login');
const query = require('../utils/github/query');
const i18n = require('../i18n');

function handler(event, context, callback) {
  const repository = event.sessionAttributes.Repository;
  const repoParts = repository.split('/');
  const owner = repoParts[0];
  const name = repoParts[1];

  const username = config.GITHUB_USERNAME;
  const password = config.GITHUB_PASSWORD;
  console.log(`Logging in with credentials ${username}:${password}`);
  login(username, password, event)
    .then((token) => {
      console.log(`Logged in successfully, token: ${token}`);
      query(token, `
        query {
          repository(owner: "${owner}", name: "${name}") {
            name
            stargazers { totalCount }
          }
        }
        `)
        .then((result) => {

          //  Create the response.
          console.log(`Result is: ${result}`);
          const data = JSON.parse(result).data;
          const projectName = data.repository.name;
          const stars = data.repository.stargazers.totalCount;
          const response = i18n('getStarsResponse', {
            projectName,
            stars
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
