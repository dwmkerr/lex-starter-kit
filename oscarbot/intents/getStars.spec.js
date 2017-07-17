const assert = require('assert');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('getStars', () => {
  it('should be able to get the stars for a project', (done) => {
    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: 'dwmkerr/angular-modal-service'
      }
    });

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/If 'angular-modal-service' keeps stealing all the stars, the night sky will soon be empty! It currently has \d+ stars/));
      done();
    });
  });
});
