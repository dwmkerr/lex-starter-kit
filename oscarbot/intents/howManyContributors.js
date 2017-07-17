const config = require('../config');
const dialog = require('../utils/dialog');
const github = require('../utils/github');
const i18n = require('../i18n');

function handler(event, context, callback) {

  //  Get the repository from the session.
  const repository = event.sessionAttributes.Repository;

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      //  Get the contributors.
      return github.get(token, `/repos/${repository}/stats/contributors`);
    })
    .then((result) => {

      //  Check the result.
      if (result.statusCode !== 200) {
        throw new Error(`Invalid status code ${result.statusCode} from API call`);
      }

      const contributors = result.body.length;

      //  Create the response.
      const response = i18n('howManyContributorsResponse', { repository, contributors });

      return dialog.fulfilled(event, response, callback);
    })
    .catch(() => {
      dialog.failed(event, 'Sorry, there was a problem getting the contributor data.', callback);
    });
}

module.exports = {
  handler
};
