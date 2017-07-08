const request = require('request-promise-native');
const config = require('../../config');
/**
 * login to github as a user.
 *
 * @param username - The username.
 * @param password - The password
 * @returns - A promise which resolves with the login token or rejects with an error.
 */
function login(username, password) {
  if (!username) throw new Error('\'username\' cannot be null');
  if (!password) throw new Error('\'password\' cannot be null');

  const auth = new Buffer(`${username.trim()}:${password.trim()}`).toString('base64');

  const options = {
    url: 'https://api.github.com/authorizations',
    headers: {
      'Authorization': `Basic ${auth}`,
      'User-Agent': 'Oscarbot',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/vnd.github.inertia-preview+json'
    },
    json: true,
    resolveWithFullResponse: true,
    body: {
      'client_id': config.GITHUB_CLIENT_ID,
      'client_secret': config.GITHUB_CLIENT_SECRET,
      'scopes': ['user', 'repo'],
      'note': 'not abuse'
    }
  };

  return request.post(options)
    .then(response => {
      if (response.statusCode < 400) {
        return response.body.token;
      } else {
        throw new Error(response.body.message);
      }
    });
}

module.exports = login;
