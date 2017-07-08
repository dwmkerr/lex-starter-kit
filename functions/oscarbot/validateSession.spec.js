const assert = require('assert');
const validateSession = require('./validateSession');
const intentProject = require('./tests/intent-project.json');
const intentProjectSlot = require('./tests/intent-project-slot.json');
const intentProjectSession = require('./tests/intent-project-session.json');


describe('validateSession', () => {
  it('Should elicit a response from user for project', (done) => {
    validateSession(intentProject, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'ProjectName');
      done();
    });
  });

  it('Should ensure the ProjectName is moved into a session variable', () => {
    const validated = validateSession(intentProjectSlot, null, null);
    assert.equal(validated, true);
    assert.equal(intentProjectSlot.sessionAttributes.ProjectName, 'angular-modal-service');
  });

  it('Should pass validation when the intent session variable is present', () => {
    const validated = validateSession(intentProjectSession, null, null);
    assert.equal(validated, true);
  });
});
