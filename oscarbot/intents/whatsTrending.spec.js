const assert = require('assert');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('whatsTrending', () => {
  it('should be able to describe what\'s trending', (done) => {
    const input = createTestInput({
      intent: 'WhatsTrending'
    });

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/The following new repos are trending/));
      done();
    });
  });
});
