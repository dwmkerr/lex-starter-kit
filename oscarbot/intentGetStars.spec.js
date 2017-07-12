const assert = require('assert');
const { handler } = require('./intentGetStars');
const getStarsWithSlots = require('./tests/get-stars-with-slots.json');

describe('intentGetStars', () => {
  it('should be able to get the stars for a project', (done) => {
    handler(getStarsWithSlots, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/angular-modal-service has \d+ stars/));
      done();
    });
  });
});
