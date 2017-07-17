const assert = require('assert');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('getForks', () => {
  it('should be able to get the forks for a project', (done) => {
    const event = createTestInput({
      intent: 'GetForks',
      slots: {
        Repository: 'dwmkerr/angular-modal-service'
      }
    });

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/'angular-modal-service' is big into kitchenware - it's got \d+ forks/));
      done();
    });
  });
});
