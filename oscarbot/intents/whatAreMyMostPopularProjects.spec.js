const assert = require('assert');
const { handler } = require('../index');
const createTestInput = require('./tests/createTestInput');

describe('intentWhatAreMyMostPopularProjects', () => {
  it('should be able to find my most popular projects', (done) => {
    const input = createTestInput({
      intent: 'WhatAreMyMostPopularProjects',
      slots: { GitHubUsername: 'dwmkerr' }
    });

    handler(input, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/Your three most popular/));
      done();
    });
  });
});
