const moment = require('moment');
const config = require('../config');
const dialog = require('../utils/dialog');
const github = require('../utils/github');
const i18n = require('../i18n');

function handler(event, context, callback) {
  const repository = event.sessionAttributes.Repository;

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      github.get(token, `/repos/${repository}/commits`)
        .then((result) => {

          //  If it looks like we've got a bad response, or no commits, bail.
          if (!result.body || !result.body[0] || !result.body[0].commit) {
            return dialog.failed(event, `I'm sorry, I can't find the commits on ${repository}.`, callback);
          }

          //  Create the response.
          const commit = result.body[0];
          const author = commit.author.login;
          const message = commit.commit.message;
          const date = commit.commit.author.date;
          const fromNow = moment(date).fromNow();

          const response = i18n('describeLastCommitResponse', {
            repository,
            author,
            fromNow,
            message
          });

          return dialog.fulfilled(event, response, callback);
        });
    })
    .catch(() => {
      return dialog.failed(event, i18n('githubError'), callback);
    });
}

module.exports = {
  handler
};
