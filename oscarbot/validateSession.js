const config = require('./config');
const github = require('./utils/github');
const dialogActions = require('./utils/dialogActions');
const i18n = require('./i18n');

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
 * repositoryHasBeenValidated - Checks to discover if repository
   has previously been validated
 *
 * @param sessionAttributes - The session attributes
 * @param repositoryName - The repository name from the slot.
 * @returns - Boolean
 */
function repositoryHasBeenValidated(sessionAttributes, repositoryName) {
  return sessionAttributes.validatedRepositories &&
    sessionAttributes.validatedRepositories.split(',').includes(repositoryName);
}

/**
 * setRepositoryValidated - Adds the repository to array of validated
   repositories
 *
 * @param sessionAttributes - The session attributes
 * @param repositoryName - The repository name from the slot.
 */
function setRepositoryValidated(sessionAttributes, repositoryName) {
  const validatedArray = sessionAttributes.validatedRepositories ?
    sessionAttributes.validatedRepositories.split(',') :
    [];

  validatedArray.push(repositoryName);
  sessionAttributes.validatedRepositories = validatedArray.join(',');
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
    if (sessionRepositoryName && !slotRepositoryName) {
      slots[REPOSITORY_SLOT] = sessionRepositoryName;
      return resolve(true);
    }
    //  If we have a project name in the slot, and it exists in the session we
    //  continue.
    //  At this point, the caller can continue. We will never store an invalid
    //  project in the session, so we can assume the project is validated and
    //  exists.
    else if (slotRepositoryName && (slotRepositoryName === sessionRepositoryName)) {
      return resolve(true);
    }

    //  There is no project name, but if might have been provided in a slot, or
    //  it might be different from the session so we have to revalidate.
    //  If so, validate it and then copy it to the session and the caller and 
    //  continue.
    else if (slotRepositoryName) {

      // Check to see if the repository has been validated previously in the
      // session, if so pop it in the sessionAttribute as our current repo
      // and continue
      if (repositoryHasBeenValidated(sessionAttributes, slotRepositoryName)) {
        event.sessionAttributes[REPOSITORY_SLOT] = slotRepositoryName;
        return resolve(true);
      }

      //  We can check the format first.
      else if (!/(.+)\/(.+)/.test(slotRepositoryName)) {
        const message = i18n('repoFormatIncorrect', { slotRepositoryName });

        callback(null, dialogActions.elicitSlot(sessionAttributes, 
          event.currentIntent.name, event.currentIntent.slots, REPOSITORY_SLOT, {
            contentType: 'PlainText',
            content: message
          }));
        return resolve(false);
      }

      //  We'd better validate the project name before we continue.
      github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
        .then((token) => {
          return github.get(token, `/repos/${slotRepositoryName}`);
        })
        .then((response) => {
          //  If we found the project, we're good. Copy the slot to a session
          //  variable and continue.
          if (response.statusCode < 400) {
            event.sessionAttributes = Object.assign({}, event.sessionAttributes);
            event.sessionAttributes[REPOSITORY_SLOT] = slotRepositoryName;
            setRepositoryValidated(event.sessionAttributes, slotRepositoryName);
            return resolve(true);
          }
        })
        .catch((err) => {
          //  If the repo couldn't be found, let the user know.
          if(err.statusCode == 404) {
            const message = i18n('repoNotFound', { slotRepositoryName });
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
          content: i18n('projectNamePrompt')
        }));
      return resolve(false);
    }
  });
}

module.exports = validateSession;
