function saveSlotIntoSessionAttribute(event, slotName) {
  //  Validate some basic event data.
  if (!event.currentIntent) throw new Error('Events must always contain a \'currentIntent\'');
  if (!event.currentIntent.slots) throw new Error('Events must always contain a \'slots\' field, even if it is empty');
  if (!slotName) throw new Error('\'slotName\' is required');

  //  Ensure we have a session attribute collection.
  if (!event.sessionAttributes) event.sessionAttributes = [];

  //  Save the slot into the session attribute.
  event.sessionAttributes[slotName] = event.currentIntent.slots[slotName];
}

module.exports = saveSlotIntoSessionAttribute;
