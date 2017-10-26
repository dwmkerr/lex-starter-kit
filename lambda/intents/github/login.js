const request = require('request-promise-native');
const config = require('../../config');

function login(username, password) {
  if (!username) throw new Error('\'username\' cannot be null');
  if (!password) throw new Error('\'password\' cannot be null');

  const auth = new Buffer(`${username.trim()}:${password.trim()}`).toString('base64');

  //  Grab the clientid and secret from the config.
  const { github: { clientId, clientSecret } } = config;
  console.log(`ClientID: '${clientId}', Secret: ${clientSecret}`);

  const options = {
    url: 'https://api.github.com/authorizations',
    headers: {
      'Authorization': `Basic ${auth}`,
      'User-Agent': 'lex-starter-kit',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/vnd.github.inertia-preview+json'
    },
    json: true,
    resolveWithFullResponse: true,
    body: {
      'client_id': clientId,
      'client_secret': clientSecret,
      'scopes': ['user', 'repo'],
      'note': 'not abuse'
    }
  };

  return request.post(options)
    .then(response => {
      if (response.statusCode < 400) {
        const token = response.body.token;

        return token;
      } else {
        throw new Error(response.body.message);
      }
    });
}

module.exports = login;
