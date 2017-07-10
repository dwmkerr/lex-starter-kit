const config = require('./config');
const github = require('./utils/github');
const dialogActions = require('./utils/dialogActions');

const REPOSITORY_SLOT = 'Repository';

/**
 * formatRepositoryName - Formats respoitory name to strip a trailing question
    mark which could get inserted into the slot
 *
 * @param repoName - The repository name from the slot.
 * @returns - A formatted repository name
 */
function formatRepositoryName(repoName) {
  return /.*\?$/.test(repoName) ? repoName.slice(0, -1) : repoName;
}

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
    const sessionRepositoryName = sessionAttributes[REPOSITORY_SLOT];
    const slots = event.currentIntent.slots || {};
    const slotRepositoryName = slots[REPOSITORY_SLOT] && formatRepositoryName(slots[REPOSITORY_SLOT]);
    
    //  If we have a project name in the session, set it into the slot.
    //  At this point, the caller can continue. We will never store an invalid
    //  project in the session, so we can assume the project is validated and
    //  exists.
    if (sessionRepositoryName) {
      slots[REPOSITORY_SLOT] = sessionRepositoryName;
      return resolve(true);
    }

    //  There is no project name, but if might have been provided in a slot.
    //  If so, validate it and then copy it to the session and the caller and 
    //  continue.
    else if (slotRepositoryName) {

      //  We can check the format first.
      if (!/(.+)\/(.+)/.test(slotRepositoryName)) {
        const message = `'${slotRepositoryName}' doesn't look like a valid repo name, can you type it again? Don't forget to include the owner, such as 'twbs/bootstrap'.`;
        callback(null, dialogActions.elicitSlot(sessionAttributes, 
          event.currentIntent.name, event.currentIntent.slots, REPOSITORY_SLOT, {
            contentType: 'PlainText',
            content: message
          }));
        return resolve(false);
      }

      //  We'd better validate the project name before we continue.
      github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD)
        .then((token) => {
          return github.get(token, `/repos/${slotRepositoryName}`);
        })
        .then((response) => {
          //  If we found the project, we're good. Copy the slot to a session
          //  variable and continue.
          if (response.statusCode < 400) {
            event.sessionAttributes = Object.assign({}, event.sessionAttributes);
            event.sessionAttributes[REPOSITORY_SLOT] = slotRepositoryName;
            return resolve(true);
          }
        })
        .catch((err) => {
          //  If the repo couldn't be found, let the user know.
          if(err.statusCode == 404) {
            const message = `I'm sorry, I couldn't find a GitHub repo called ${slotRepositoryName}. Can you make sure I have access to the repo if it is private, ensure the name is in the format 'user/project' and type it again?`;
            callback(null, dialogActions.elicitSlot(sessionAttributes, 
              event.currentIntent.name, event.currentIntent.slots, REPOSITORY_SLOT, {
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
        event.currentIntent.name, event.currentIntent.slots, REPOSITORY_SLOT, {
          contentType: 'PlainText',
          content: 'What is the project name?'
        }));
      return resolve(false);
    }
  });
}

module.exports = validateSession;
