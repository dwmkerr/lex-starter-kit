const assert = require('assert');
const createEvent = require('../testing/createEvent');
const whatTime = require('./whatTime');

describe('intent \'whatTime\'', () => {

  it('shold be able to tell the time', () => {
    //  Create the event.
    const event = createEvent({
      intent: 'WhatTime'
    });

    //  Fire the handler, providing the event.
    return whatTime(event).then((response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/[Tt]he time is/));
    });
  });
});
