const assert = require('assert');
const createEvent = require('./createEvent');

describe('createEvent', () => {

  it('should throw if no options are provided', () => {
    assert.throws(() => createEvent(), /options/);
  });

  it('should throw if no intent is provided', () => {
    assert.throws(() => createEvent({ }), /options.intent/);
  });

});
