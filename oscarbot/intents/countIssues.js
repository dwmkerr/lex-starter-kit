const config = require('../config');
const getRepoOwnerAndName = require('../utils/getRepoOwnerAndName');
const dialog = require('../utils/dialog');
const github = require('../utils/github');
const i18n = require('../i18n');

function handler(event, context, callback) {
  const repository = event.sessionAttributes.Repository;
  const { owner, name } = getRepoOwnerAndName(repository);

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      github.query(token, `
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
          const response = i18n('countIssuesResponse', {
            projectName,
            issues
          });

          return dialog.fulfilled(event, response, callback);
        });
    });
}

module.exports = {
  handler
};
