const assert = require('assert');
const { handler } = require('./intentCountIssues');
const countIssuesWithSlots = require('./tests/count-issues-with-slots.json');

describe('intentCountIssues', () => {
  it('should be able to count the issues for a project', (done) => {
    handler(countIssuesWithSlots, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/angular-modal-service has \d+ open issues/));
      done();
    });
  });
});
