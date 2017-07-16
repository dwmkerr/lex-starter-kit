const request = require('request-promise-native');

/**
 * Runs a DELETE request on the REST API.
 *
 * @param token - The authorization token. Generate with a call to 'login'.
 * @param path - The REST API path.
 * @param content - The object to send. Can be null.
 * @returns {undefined} - A promise which resolves with the response object.
 */
function del(token, path, content) {
  const options = {
    uri: `https://api.github.com${path}`,
    method: 'DELETE',
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

module.exports = del;
