const config = require('./config');
const github = require('./utils/github');
const dialogActions = require('./utils/dialogActions');

const PROJECT_SLOT = 'ProjectName';

/**
 * validateSession - Ensures that we have sufficient session data. Will initiate
   dialog actions to get session data if needed.
 *
 * @param event - The lex event.
 * @param context - The lex context.
 * @param callback - The lex callback.
 * @returns - A promise which resolves with true if the session is valid and 
   dialog should continue, false if data needs to be elicited and the caller
   should return.
 */
function validateSession(event, context, callback) {
  return new Promise((resolve, reject) => {
    const sessionAttributes = event.sessionAttributes || {};
    const sessionProjectName = sessionAttributes[PROJECT_SLOT];
    const slots = event.currentIntent.slots || {};
    const slotProjectName = slots[PROJECT_SLOT];
    
    //  If we have a project name in the session, set it into the slot.
    //  At this point, the caller can continue. We will never store an invalid
    //  project in the session, so we can assume the project is validated and
    //  exists.
    if (sessionProjectName) {
      slots[PROJECT_SLOT] = sessionProjectName;
      return resolve(true);
    }

    //  There is no project name, but if might have been provided in a slot.
    //  If so, validate it and then copy it to the session and the caller and 
    //  continue.
    else if (slotProjectName) {

      //  We can check the format first.
      if (!/(.+)\/(.+)/.test(slotProjectName)) {
        const message = `'${slotProjectName} doesn't look like a valid repo name (such as 'user/repo') can you type it again?`;
        callback(null, dialogActions.elicitSlot(sessionAttributes, 
          event.currentIntent.name, event.currentIntent.slots, PROJECT_SLOT, {
            contentType: 'PlainText',
            content: message
          }));
        return resolve(false);
      }

      //  We'd better validate the project name before we continue.
      github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD)
        .then((token) => {
          return github.get(token, `/repos/${slotProjectName}`);
        })
        .then((response) => {
          //  If we found the project, we're good. Copy the slot to a session
          //  variable and continue.
          if (response.statusCode < 400) {
            event.sessionAttributes = Object.assign({}, event.sessionAttributes);
            event.sessionAttributes[PROJECT_SLOT] = slotProjectName;
            return resolve(true);
          }
        })
        .catch((err) => {
          debugger;
          //  If the repo couldn't be found, let the user know.
          if(err.statusCode == 404) {
            const message = `I'm sorry, I couldn't find a GitHub repo called ${slotProjectName}. Can you make sure I have access to the repo if it is private, ensure the name is in the format 'user/project' and type it again?`;
            callback(null, dialogActions.elicitSlot(sessionAttributes, 
              event.currentIntent.name, event.currentIntent.slots, PROJECT_SLOT, {
                contentType: 'PlainText',
                content: message
              }));
            return resolve(false);
          }

          //  If there is some other kind of error, then who knows.
          return reject(err);
        });
    }

    //  There is no project name, so elicit one.
    else {
      callback(null, dialogActions.elicitSlot(sessionAttributes, 
        event.currentIntent.name, event.currentIntent.slots, PROJECT_SLOT, {
          contentType: 'PlainText',
          content: 'What is the project name?'
        }));
      return resolve(false);
    }
  });
}

module.exports = validateSession;
