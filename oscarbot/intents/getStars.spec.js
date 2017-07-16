const assert = require('assert');
const { handler } = require('../index');
const getStarsWithSlots = require('./tests/get-stars-with-slots.json');

describe('intentGetStars', () => {
  it('should be able to get the stars for a project', (done) => {
    handler(getStarsWithSlots, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/If angular-modal-service keeps stealing all the stars, the night sky will soon be empty! It currently has \d+ stars/));
      done();
    });
  });
});
