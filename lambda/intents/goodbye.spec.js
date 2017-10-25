const assert = require('assert');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('goodbye', () => {
  it('should clear the session', (done) => {
    const event = createTestInput({
      intent: 'Goodbye',
      sessionAttributes: {
        Repository: 'dwmkerr/spaceinvaders'
      }
    });

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert.equal(response.sessionAttributes.Repository, undefined);
      assert(response.dialogAction.message.content.match(/Bye!/));
      done();
    });
  });
});
