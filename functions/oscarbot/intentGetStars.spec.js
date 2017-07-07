const assert = require('assert');
const { handler } = require('./intentGetStars');
const getStars = require('./tests/get-stars.json');
const getStarsWithSlots = require('./tests/get-stars-with-slots.json');

describe('intentGetStars', () => {
  it('should ask for a project name if one isn\'t provided', (done) => {
    handler(getStars, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'ProjectName');
      assert(response.dialogAction.message.match(/project name/));
      done();
    });
  });

  it('should be able to get the stars for a project', (done) => {
    handler(getStarsWithSlots, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/angular-modal-service has \d+ stars/));
      done();
    });
  });
});
