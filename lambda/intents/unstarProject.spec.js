const assert = require('assert');
const config = require('../config');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('intentUnstarProject', () => {
  it('should be able to unstar a project', (done) => {
    const input = createTestInput({
      intent: 'UnstarProject',
      slots: {
        Repository: 'mindmelting/lex-oscarbot',
        GitHubUsername: config.GITHUB_USERNAME,
        GitHubPassword: config.GITHUB_PASSWORD
      }
    });

    //  Take the test event, and set its confirmation status.
    const event = Object.assign({}, input);
    event.currentIntent.confirmationStatus = 'Confirmed';

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/I've unstarred 'mindmelting\/lex-oscarbot' for you/));
      done();
    });
  });
});
