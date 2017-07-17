const config = require('../config');
const dialog = require('../utils/dialog');
const getRepoOwnerAndName = require('../utils/getRepoOwnerAndName');
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
            return `${a} \n _${b.title}_ - ${b.url}`;
          }, '');
          const response = i18n('topIssuesResponse', {
            projectName,
            issueText
          });

          return dialog.fulfilled(event, response, callback);
        });
    });
}

module.exports = {
  handler
};
