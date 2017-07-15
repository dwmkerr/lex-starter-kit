const assert = require('assert');
const { handler } = require('./index');
const createTestInput = require('./tests/createTestInput');

describe('intentWhatCanIAskYou', () => {
  it('should be able to list utterances', (done) => {
    const input = createTestInput({
      intent: 'WhatCanIAskYou'
    });

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/You can ask me things like/));
      done();
    });
  });
});
