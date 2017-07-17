const assert = require('assert');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('howManyContributors', () => {
  it('should be able to determine the number of contributors', (done) => {
    const input = createTestInput({
      intent: 'HowManyContributors',
      slots: {
        Repository: 'mindmelting/lex-oscarbot'
      }
    });

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/mindmelting\/lex-oscarbot has \d+ contributors/));
      done();
    });
  });
});
