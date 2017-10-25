const assert = require('assert');
const createEvent = require('./testing/createEvent');
const handler = require('./handler');

describe('handler', () => {

  it('should be able to match a \'WhatTime\' intent', (done) => {
    //  Create the event.
    const event = createEvent({
      intent: 'WhatTime'
    });

    handler(event, null, (err, response) => {
      //  We should be ready to close the intent
      assert.equal(response.dialogAction.type, 'Close');
      done();
    });
  });
});
