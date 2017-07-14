const request = require('request-promise-native');
const config = require('../../config');

const GITHUB_TOKEN_KEY = 'GithubToken';

/**
 * Sets the token on the session attrbiutes.
 *
 * @param token - The Github token
 * @param event - The Lex event
 */
function setSessionToken(token, event) {
  if (!event.sessionAttributes) {
    event.sessionAttributes = {};
  }

  event.sessionAttributes[GITHUB_TOKEN_KEY] = token;
}

/**
 * login to github as a user.
 *
 * @param username - The username.
 * @param password - The password
 * @param event - The Lex event
 * @returns - A promise which resolves with the login token or rejects with an error.
 */
function login(username, password, event) {
  if (!username) throw new Error('\'username\' cannot be null');
  if (!password) throw new Error('\'password\' cannot be null');

  if (event.sessionAttributes && event.sessionAttributes[GITHUB_TOKEN_KEY]) {
    return Promise.resolve(event.sessionAttributes[GITHUB_TOKEN_KEY]);
  }

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
        const token = response.body.token;

        setSessionToken(token, event);

        return token;
      } else {
        throw new Error(response.body.message);
      }
    });
}

module.exports = login;
