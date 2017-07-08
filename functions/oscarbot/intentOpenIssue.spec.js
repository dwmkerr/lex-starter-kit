const assert = require('assert');
const { handler } = require('./intentOpenIssue');
const openIssue = require('./tests/open-issue.json');
const openIssueWithTitle = require('./tests/open-issue-with-title.json');
const openIssueWithSlots = require('./tests/open-issue-with-slots.json');

describe('intentOpenIssue', () => {
  it('should ask for an issue title if one isn\'t provided', (done) => {
    handler(openIssue, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'IssueTitle');
      assert(response.dialogAction.message.content.match(/title/));
      done();
    });
  });

  it('should ask for issue content if none is provided', (done) => {
    handler(openIssueWithTitle, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'IssueContent');
      assert(response.dialogAction.message.content.match(/description/));
      done();
    });
  });

  //  This is disabled by default otherwise we get lots of issues added to the repo.
  xit('should be able to open an issue', (done) => {
    handler(openIssueWithSlots, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/opened the issue/));
      done();
    });
  });
});
