const config = require('../config');
const dialog = require('../utils/dialog');
const github = require('../utils/github');
const i18n = require('../i18n');
const getRepoOwnerAndName = require('../utils/getRepoOwnerAndName');

function handler(event, context, callback) {
  const repository = event.sessionAttributes.Repository;
  const { owner, name } = getRepoOwnerAndName(repository);

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      github.query(token, `
        query {
          repository(owner: "${owner}", name: "${name}") {
            name
            forks { totalCount }
          }
        }
        `)
        .then((result) => {

          //  Create the response.
          const data = JSON.parse(result).data;
          const projectName = data.repository.name;
          const forks = data.repository.forks.totalCount;
          const response = i18n('getForksResponse', {
            projectName,
            forks
          });

          return dialog.fulfilled(event, response, callback);
        });
    });
}

module.exports = {
  handler
};
