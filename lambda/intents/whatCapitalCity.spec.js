const assert = require('assert');
const createEvent = require('../testing/createEvent');
const whatCapitalCity = require('./whatCapitalCity');

describe('intent \'whatCapitalCity\'', () => {
  it('should elicit the Country slot if not provided', async () => {
    //  Create the event.
    const event = createEvent({
      intent: 'WhatCapitalCity'
    });

    //  Fire the handler, providing the event.
    const response = await whatCapitalCity(event);
    assert.equal(response.dialogAction.type, 'ElicitSlot');
    assert.equal(response.dialogAction.intentName, 'WhatCapitalCity');
    assert.equal(response.dialogAction.slotToElicit, 'Country');
    assert.equal(response.dialogAction.message.contentType, 'PlainText');
    assert.equal(response.dialogAction.message.content, 'What is the country you want to know the capital city of?');
  });

  it('should be able to give the capital city of a given country', async () => {
    //  Create the event.
    const event = createEvent({
      intent: 'WhatCapitalCity',
      slots: {
        Country: 'Indonesia',
      }
    });

    //  Fire the handler, providing the event.
    const response = await whatCapitalCity(event);
    assert.equal(response.dialogAction.type, 'Close');
    assert.equal(response.dialogAction.fulfillmentState, 'Fulfilled');
    assert.equal(response.dialogAction.message.contentType, 'PlainText');
    assert.equal(response.dialogAction.message.content, 'The capital of Indonesia is Jakarta.');
  });

  it('should be able to give the capital city of a given country with mis-spelled input', async () => {
    //  Create the event.
    const event = createEvent({
      intent: 'WhatCapitalCity',
      slots: {
        Country: 'indenesia', // note the mis-spelling and lack of capitalisation...
      }
    });

    //  Fire the handler, providing the event.
    const response = await whatCapitalCity(event);
    assert.equal(response.dialogAction.type, 'Close');
    assert.equal(response.dialogAction.fulfillmentState, 'Fulfilled');
    assert.equal(response.dialogAction.message.contentType, 'PlainText');
    assert.equal(response.dialogAction.message.content, 'The capital of Indonesia is Jakarta.');
  });

  it('should correctly respond if the country is not found', async () => {
    //  Create the event.
    const event = createEvent({
      intent: 'WhatCapitalCity',
      slots: {
        Country: 'Yellowstone', // not a real country!
      }
    });

    //  Fire the handler, providing the event.
    const response = await whatCapitalCity(event);
    assert.equal(response.dialogAction.type, 'Close');
    assert.equal(response.dialogAction.fulfillmentState, 'Failed');
    assert.equal(response.dialogAction.message.contentType, 'PlainText');
    assert.equal(response.dialogAction.message.content, 'I can\'t find a country called Yellowstone.');
  });
});
