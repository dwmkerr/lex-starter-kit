const assert = require('assert');
const validateSession = require('./validateSession');
const intentRepository = require('./intents/tests/intent-repository.json');
const intentRepositorySlot = require('./intents/tests/intent-repository-slot.json');
const intentRepositoryQuestionSlot = require('./intents/tests/intent-repository-question-slot.json');
const intentRepositorySession = require('./intents/tests/intent-repository-session.json');


describe('validateSession', () => {
  it('Should elicit a response from user for repository', (done) => {
    validateSession(intentRepository, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'Repository');
      done();
    });
  });

  it('Should ensure that a valid ProjectName is moved into a session variable', (done) => {
    validateSession(intentRepositorySlot, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(intentRepositorySlot.sessionAttributes.Repository, 'dwmkerr/angular-modal-service');
        done();
      });
  });

  it('Should ensure that a valid ProjectName with question mark is moved into a session variable', (done) => {
    validateSession(intentRepositoryQuestionSlot, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(intentRepositoryQuestionSlot.sessionAttributes.Repository, 'dwmkerr/angular-modal-service');
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
      assert(response.dialogAction.message.content.match(/I'm picky with spelling/));
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
      assert(response.dialogAction.message.content.match(/If it's private I may not have access/));
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

  it('If slot repository is different from session repository, replace into session variable', (done) => {
    const newIntent = Object.assign({}, intentRepositorySession, {
      currentIntent: {
        slots: {
          Repository: 'mindmelting/lex-boilerplate'
        }
      }
    });
    validateSession(newIntent, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(newIntent.sessionAttributes.Repository, 'mindmelting/lex-boilerplate');
        done();
      });
  });

  it('Should update repository into validatedRepositories array', (done) => {
    validateSession(intentRepositorySlot, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(intentRepositorySlot.sessionAttributes.validatedRepositories, 'dwmkerr/angular-modal-service');
        done();
      });
  });

  it('Should add repository into validatedRepositories array', (done) => {
    const newIntent = Object.assign({}, intentRepositorySession, {
      currentIntent: {
        slots: {
          Repository: 'mindmelting/lex-boilerplate'
        }
      },
      sessionAttributes: {
        validatedRepositories: 'dwmkerr/angular-modal-service'
      }
    });
    validateSession(newIntent, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(newIntent.sessionAttributes.validatedRepositories, 'dwmkerr/angular-modal-service,mindmelting/lex-boilerplate');
        done();
      });
  });
});
