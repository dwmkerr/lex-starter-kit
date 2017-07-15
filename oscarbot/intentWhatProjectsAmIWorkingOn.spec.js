const assert = require('assert');
const { handler } = require('./index');
const createTestInput = require('./tests/createTestInput');

describe('intentWhatProjectsAmIWorkingOn', () => {
  it('should be able to tell me what projects I am working on', (done) => {
    const input = createTestInput({
      intent: 'WhatProjectsAmIWorkingOn',
      slots: { GitHubUsername: 'dwmkerr' }
    });

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/You own \d+ repositories/));
      done();
    });
  });
});
