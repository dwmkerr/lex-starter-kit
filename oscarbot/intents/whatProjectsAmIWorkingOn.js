const config = require('../config');
const dialog = require('../utils/dialog');
const github = require('../utils/github');
const i18n = require('../i18n');

function handler(event, context, callback) {
  const gitHubUsername = event.currentIntent.slots.GitHubUsername;

  //  Elicit the required slots.
  if (!gitHubUsername) return dialog.elicitSlot(event, 'GitHubUsername', i18n('elicitSlotGitHubUser'), callback);

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      github.query(token, `
        query {
          user(login: "${gitHubUsername}") {
            repositories(first:3, orderBy: { field: STARGAZERS, direction: DESC}) {
              totalCount
              nodes {
                nameWithOwner
                stargazers { totalCount }
              }
            }
            contributedRepositories {
              totalCount
            }
          }
        }`)
        .then((result) => {

          const data = JSON.parse(result).data;
          const myReposCount = data.user.repositories.totalCount;
          const myTopThreeRepos = data.user.repositories.nodes.map((n) => { return { name: n.nameWithOwner, stars: n.stargazers.totalCount }; });
          const contributedReposCount = data.user.contributedRepositories.totalCount;
          const response = i18n('whatProjectsAmIWorkingOnResponse', {
            myReposCount,
            myTopThreeRepos,
            contributedReposCount
          });

          return dialog.fulfilled(event, response, callback);
        });
    });
}

module.exports = {
  handler
};
