const assert = require('assert');
const createEvent = require('../testing/createEvent');
const whatDate = require('./whatDate');

describe('intent \'whatDate\'', () => {

  it('shold be able to tell the date', () => {
    //  Create the event.
    const event = createEvent({
      intent: 'WhatDate'
    });

    //  Fire the handler, providing the event.
    return whatDate(event).then((response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/[Tt]he date is/));
    });
  });
});
