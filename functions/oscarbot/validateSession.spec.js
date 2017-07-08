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

  it('Should ensure that a valid PojectName is moved into a session variable', (done) => {
    validateSession(intentProjectSlot, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(intentProjectSlot.sessionAttributes.ProjectName, 'dwmkerr/angular-modal-service');
        done();
      });
  });

  it('should not allow an invalid project name format', (done) => {
    //  Get the project intent, and set an invalid project name.
    const newIntent = Object.assign({}, intentProject, {
      currentIntent: {
        slots: {
          ProjectName: 'norepo'
        }
      }
    });
    validateSession(newIntent, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'ProjectName');
      assert(response.dialogAction.message.content.match(/doesn't look like a valid repo name/));
      done();
    });
  });

  it('should not validate a non-existent project', (done) => {
    //  Get the project intent, and set an invalid project name.
    const newIntent = Object.assign({}, intentProject, {
      currentIntent: {
        slots: {
          ProjectName: 'nouser/norepo'
        }
      }
    });
    validateSession(newIntent, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'ProjectName');
      assert(response.dialogAction.message.content.match(/I couldn't find/));
      done();
    });
  });

  it('Should pass validation when the intent session variable is present', (done) => {
    validateSession(intentProjectSession, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        done();
      });
  });
});
