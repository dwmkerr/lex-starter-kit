const assert = require('assert');
const config = require('../config');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('intentCountIssues', () => {

  it('should be able to count the issues for a project', (done) => {
    const event = createTestInput({
      intent: 'CountIssues',
      sessionAttributes: {
        Repository: 'dwmkerr/angular-modal-service'
      }
    });

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/Jay-Z has 99 problems but angular-modal-service only has \d+!/));
      done();
    });
  });

  it('should fail gracefully if there is an error communicating with GitHub', (done) => {
    const event = createTestInput({
      intent: 'CountIssues',
      sessionAttributes: {
        Repository: 'dwmkerr/angular-modal-service'
      }
    });

    //  Before we run the test, blat the password.
    const oldPassword = config.GITHUB_PASSWORD;
    config.GITHUB_PASSWORD = 'thisaintgonnawork';

    handler(event, null, (err, response) => {
      config.GITHUB_PASSWORD = oldPassword;
      assert.equal(response.dialogAction.type, 'Close');
      assert.equal(response.dialogAction.fulfillmentState, 'Failed');
      assert(response.dialogAction.message.content.match(/there was a problem talking to Github/));
      done();
    });
  });
});
