const assert = require('assert');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('intentCountOpenPRs', () => {
  it('should be able to count the open PRs for a project', (done) => {
    const input = createTestInput({
      intent: 'CountOpenPRs',
      sessionAttributes: { Repository: 'dwmkerr/angular-modal-service' }
    });

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/'angular-modal-service' has \d+ open pull requests/));
      done();
    });
  });
});
