const assert = require('assert');
const { handler } = require('./index');
const createTestInput = require('./tests/createTestInput');

describe('intentMyOpenIssues', () => {
  it('should be able to tell me what projects I am working on', (done) => {
    const input = createTestInput({
      intent: 'MyOpenIssues',
      slots: { GitHubUsername: 'mindmelting' }
    });

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/Your top five updated issues are/));
      done();
    });
  });
});
