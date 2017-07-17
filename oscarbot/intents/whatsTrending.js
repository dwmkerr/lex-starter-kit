const moment = require('moment');
const querystring = require('querystring');
const config = require('../config');
const dialog = require('../utils/dialog');
const github = require('../utils/github');
const i18n = require('../i18n');

function handler(event, context, callback) {

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      //  Create the start date for the query.
      const startDate = moment().subtract(7,'d').format();

      //  Create the query.
      const searchParameters = {
        sort: 'stars',
        order: 'desc',
        q: [/* 'language:javascript', */`created:>${startDate}`]
      };
      const query = querystring.stringify(searchParameters);

      //  Run the search.
      const uri = `/search/repositories?${query}`;
      return github.get(token, uri);
    })
    .then((result) => {

      //  Check the result.
      if (result.statusCode !== 200) {
        throw new Error(`Invalid status code ${result.statusCode} from API call`);
      }

      //  Get the top ten trending.
      const topTen = result.body.items.map((r) => {
        return {
          name: r.full_name,
          stars: r.stargazers_count
        }; 
      }).slice(0, 10);
      const list = topTen.map(t => ` - ${t.name} (${t.stars} stars)`).join('\n');


      //  Create the response.
      const response = i18n('whatsTrendingSuccessResponse', { list });

      return dialog.fulfilled(event, response, callback);
    })
    .catch((err) => {
      dialog.failed(event, 'Sorry, there was a problem getting the trending data.', callback);
    });
}

module.exports = {
  handler
};
