function loadSessionAttributesIntoSlots(event) {
  //  Validate some basic event data.
  if (!event.currentIntent) throw new Error('Events must always contain a \'currentIntent\'');
  if (!event.currentIntent.slots) throw new Error('Events must always contain a \'slots\' field, even if it is empty');

  //  Go through every slot, we'll see if we can fill it from the session.
  Object.keys(event.currentIntent.slots).forEach((slotName) => {
    //  If there is a session attribute for the slot, use that.
    if (event.sessionAttributes && event.sessionAttributes[slotName]) {
      event.currentIntent.slots[slotName] = event.sessionAttributes[slotName];
    }
  });
}

module.exports = loadSessionAttributesIntoSlots;
