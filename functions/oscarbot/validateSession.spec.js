const assert = require('assert');
const validateSession = require('./validateSession');
const intentRepository = require('./tests/intent-repository.json');
const intentRepositorySlot = require('./tests/intent-repository-slot.json');
const intentRepositorySession = require('./tests/intent-repository-session.json');


describe('validateSession', () => {
  it('Should elicit a response from user for repository', (done) => {
    validateSession(intentRepository, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'Repository');
      done();
    });
  });

  it('Should ensure that a valid PojectName is moved into a session variable', (done) => {
    validateSession(intentRepositorySlot, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(intentRepositorySlot.sessionAttributes.Repository, 'dwmkerr/angular-modal-service');
        done();
      });
  });

  it('should not allow an invalid repository name format', (done) => {
    //  Get the repository intent, and set an invalid repository name.
    const newIntent = Object.assign({}, intentRepository, {
      currentIntent: {
        slots: {
          Repository: 'norepo'
        }
      }
    });
    validateSession(newIntent, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'Repository');
      assert(response.dialogAction.message.content.match(/doesn't look like a valid repo name/));
      done();
    });
  });

  it('should not validate a non-existent repository', (done) => {
    //  Get the repository intent, and set an invalid repository name.
    const newIntent = Object.assign({}, intentRepository, {
      currentIntent: {
        slots: {
          Repository: 'nouser/norepo'
        }
      }
    });
    validateSession(newIntent, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'Repository');
      assert(response.dialogAction.message.content.match(/I couldn't find/));
      done();
    });
  });

  it('Should pass validation when the intent session variable is present', (done) => {
    validateSession(intentRepositorySession, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        done();
      });
  });
});
