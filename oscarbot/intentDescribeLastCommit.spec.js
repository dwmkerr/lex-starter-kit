const assert = require('assert');
const { handler } = require('./index');
const createTestInput = require('./tests/createTestInput');

describe('intentDescribeLastCommit', () => {
  it('should be able to describe the last commit for a project', (done) => {
    const input = createTestInput({
      intent: 'DescribeLastCommit',
      sessionAttributes: { Repository: 'dwmkerr/sharpgl' }
    });

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/was the most recent person to comment/));
      done();
    });
  });
});
