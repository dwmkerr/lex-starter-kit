const assert = require('assert');
const { handler } = require('./intentTopIssues');
const listIssuesWithSlots = require('./tests/list-issues-with-slots.json');

describe('intentTopIssues', () => {
  it('should be able to list the issues for a project', (done) => {
    handler(listIssuesWithSlots, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/angular-modal-service.*/));
      done();
    });
  });
});
