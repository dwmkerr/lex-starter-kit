const assert = require('assert');
const { handler } = require('./index');
const intentProject = require('./tests/intent-project.json');
const intentProjectSlot = require('./tests/intent-project-slot.json');

describe('Core', () => {
  it('Should elicit a response from user for project', (done) => {
    handler(intentProject, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'ProjectName');
      done();
    });
  });

  it('Should delegate to lex with added session attribute', (done) => {
    handler(intentProjectSlot, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'Delegate');
      assert.equal(response.sessionAttributes.ProjectName, 'angular-modal-service');
      done();
    });
  });

  it('Should delegate to lex with added slot value', (done) => {
    handler(intentProjectSlot, null, (err, response) => {
      console.log(response);
      assert.equal(response.dialogAction.type, 'Delegate');
      assert.equal(response.dialogAction.slots.ProjectName, 'angular-modal-service');
      done();
    });
  });
});
