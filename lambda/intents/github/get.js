const request = require('request-promise-native');

/**
 * Runs a 'GET' request.
 *
 * @param token - The authorization token. Generate with a call to 'login'.
 * @param path - The relative path, e.g. /repos/dwmkerr/spaceinvaders.
 * @returns {undefined} - A promise which resolves with the response object.
 */
function get(token, path, content) {
  const options = {
    uri: `https://api.github.com${path}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Oscarbot',
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.inertia-preview+json'
    },
    json: true,
    resolveWithFullResponse: true,
    body: content
  };
  
  return request(options);
}

module.exports = get;
