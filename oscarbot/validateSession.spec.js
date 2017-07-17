const assert = require('assert');
const validateSession = require('./validateSession');
const createTestInput = require('./intents/tests/createTestInput');

describe('validateSession', () => {
  it('Should elicit a response from user for repository', (done) => {

    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: null
      }
    });

    validateSession(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'Repository');
      done();
    });
  });

  it('Should ensure that a valid ProjectName is moved into a session variable', (done) => {

    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: 'dwmkerr/angular-modal-service'
      }
    });

    validateSession(event, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(event.sessionAttributes.Repository, 'dwmkerr/angular-modal-service');
        done();
      });
  });

  it('Should ensure that a valid ProjectName with question mark is moved into a session variable', (done) => {

    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: 'dwmkerr/angular-modal-service?'
      }
    });

    validateSession(event, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(event.sessionAttributes.Repository, 'dwmkerr/angular-modal-service');
        done();
      });
  });

  it('should not allow an invalid repository name format', (done) => {

    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: 'norepo'
      }
    });

    validateSession(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'Repository');
      assert(response.dialogAction.message.content.match(/I'm picky with spelling/));
      done();
    });
  });

  it('should not validate a non-existent repository', (done) => {

    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: 'nouser/norepo'
      }
    });

    validateSession(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'Repository');
      assert(response.dialogAction.message.content.match(/If it's private I may not have access/));
      done();
    });
  });

  it('Should pass validation when the intent session variable is present', (done) => {

    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: null
      },
      sessionAttributes: {
        Repository: 'mindmelting/lex-oscarbot'
      }
    });
    
    validateSession(event, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        done();
      });
  });

  it('If slot repository is different from session repository, replace into session variable', (done) => {
    
    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: 'mindmelting/lex-boilerplate'
      },
      sessionAttributes: {
        Repository: 'mindmelting/lex-oscarbot'
      }
    });

    validateSession(event, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(event.sessionAttributes.Repository, 'mindmelting/lex-boilerplate');
        done();
      });
  });

  it('Should update repository into validatedRepositories array', (done) => {

    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: 'dwmkerr/angular-modal-service'
      }
    });

    validateSession(event, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(event.sessionAttributes.validatedRepositories, 'dwmkerr/angular-modal-service');
        done();
      });
  });

  it('Should add repository into validatedRepositories array', (done) => {

    const event = createTestInput({
      intent: 'GetStars',
      slots: {
        Repository: 'mindmelting/lex-boilerplate'
      },
      sessionAttributes: {
        validatedRepositories: 'dwmkerr/angular-modal-service'
      }
    });

    validateSession(event, null, null)
      .then((validated) => {
        assert.equal(validated, true);
        assert.equal(event.sessionAttributes.validatedRepositories, 'dwmkerr/angular-modal-service,mindmelting/lex-boilerplate');
        done();
      });
  });
});
