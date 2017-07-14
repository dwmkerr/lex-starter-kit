const request = require('request-promise-native');

/**
 * Run a graphql query against github, using the provided tokens.
 *
 * @param token - The authorization token. Generate with a call to 'login'.
 * @param query - The GraphQL query.
 * @param variables - The variables for the query. Optional.
 * @returns {undefined} - A promise which resolves with the response object.
 */
function query(token, query, variables = {}) {
  const options = {
    uri: 'https://api.github.com/graphql',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Oscarbot',
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.inertia-preview+json'
    },
    body: JSON.stringify({ query: query, variables: variables })
  };
  
  return request(options);
}

module.exports = query;
