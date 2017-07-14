const moment = require('moment');
const config = require('./config');
const dialogActions = require('./utils/dialogActions');
const getRepoOwnerAndName = require('./utils/getRepoOwnerAndName');
const github = require('./utils/github');
const i18n = require('./i18n');

function handler(event, context, callback) {
  const repository = event.sessionAttributes.Repository;
  const { owner, name } = getRepoOwnerAndName(repository);

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      github.query(token, `
        query { 
          repository(owner: "${owner}", name: "${name}") {
            name
            pullRequests(states: OPEN) {
              totalCount
            }
          }
        }`)
        .then((result) => {

          const data = JSON.parse(result).data;
          const projectName = data.repository.name;
          const openPullRequests = data.repository.pullRequests.totalCount;
          const response = i18n('countOpenPRsResponse', {
            projectName,
            openPullRequests
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
