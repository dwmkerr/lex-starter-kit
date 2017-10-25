const assert = require('assert');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('openIssue', () => {
  it('should ask for an issue title if one isn\'t provided', (done) => {

    const event = createTestInput({
      intent: 'OpenIssue',
      confirmationStatus: 'Confirmed',
      slots: {
        Repository: null
      },
      sessionAttributes: {
        Repository: 'dwmkerr/spaceinvaders'
      }
    });

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'IssueTitle');
      assert(response.dialogAction.message.content.match(/title/));
      done();
    });
  });

  it('should ask for issue content if none is provided', (done) => {

    const event = createTestInput({
      intent: 'OpenIssue',
      slots: {
        Repository: null,
        IssueTitle: 'Something is broken',
        IssueContent: null
      },
      sessionAttributes: {
        Repository: 'dwmkerr/spaceinvaders'
      }
    });

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'IssueContent');
      assert(response.dialogAction.message.content.match(/description/));
      done();
    });
  });

  //  This is disabled by default otherwise we get lots of issues added to the repo.
  xit('should be able to open an issue', (done) => {

    const event = createTestInput({
      intent: 'OpenIssue',
      confirmationStatus: 'Confirmed',
      slots: {
        Repository: null,
        IssueTitle: 'Something is broken',
        IssueContent: 'There is a glitch in the matrix'
      },
      sessionAttributes: {
        Repository: 'mindmelting/lex-oscarbot'
      }
    });

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/issue is now open/));
      done();
    });
  });
});
