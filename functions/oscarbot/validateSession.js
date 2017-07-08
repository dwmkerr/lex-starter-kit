const dialogActions = require('./utils/dialogActions');

const PROJECT_SLOT = 'ProjectName';

/**
 * validateSession - Ensures that we have sufficient session data. Will initiate
   dialog actions to get session data if needed.
 *
 * @param event - The lex event.
 * @param context - The lex context.
 * @param callback - The lex callback.
 * @returns - True if the session is valid and dialog continue, false if data
   need to be elicited and the caller should return.
 */
function validateSession(event, context, callback) {
  const sessionAttributes = event.sessionAttributes || {};
  const sessionProjectName = sessionAttributes[PROJECT_SLOT];
  const slots = event.currentIntent.slots || {};
  const slotProjectName = slots[PROJECT_SLOT];
  
  //  If we have a project name in the session, set it into the slot.
  //  At this point, the caller can continue.
  if (sessionProjectName) {
    slots[PROJECT_SLOT] = sessionProjectName;
    return true;
  }

  //  There is no project name, but if might have been provided in a slot.
  //  If so, copy it to the session and the caller and continue.
  if (slotProjectName) {
    event.sessionAttributes = Object.assign({}, event.sessionAttributes);
    event.sessionAttributes[PROJECT_SLOT] = slotProjectName;
    return true;
  }

  //  There is no project name, so elicit one.
  callback(null, dialogActions.elicitSlot(sessionAttributes, 
    event.currentIntent.name, event.currentIntent.slots, PROJECT_SLOT, {
      contentType: 'PlainText',
      content: 'What is the project name?'
    }));
  return false;
}

module.exports = validateSession;
