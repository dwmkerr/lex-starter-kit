const assert = require('assert');
const config = require('../config');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('intentStarProject', () => {
  it.only('should not star a project if the confirmation status is \'Denied\'', (done) => {
    const input = createTestInput({
      intent: 'StarProject',
      slots: {
        Repository: 'mindmelting/lex-oscarbot',
        GitHubUsername: config.GITHUB_USERNAME,
        GitHubPassword: config.GITHUB_PASSWORD
      }
    });
    input.currentIntent.confirmationStatus = 'Denied';

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/Ok, I will not star the repository./));
      done();
    });
  });

  it('should be able to star a project', (done) => {
    const input = createTestInput({
      intent: 'StarProject',
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
      assert(response.dialogAction.message.content.match(/I've starred mindmelting\/lex-oscarbot for you/));
      done();
    });
  });
});
