const intentGetStars = require('./intentGetStars');
const dialogActions = require('./utils/dialogActions');

const PROJECT_SLOT = 'ProjectName'

const INTENT_HANDLERS = {
	GetStars: intentGetStars
};

function getProjectNameFromSlot(event) {
	return event.currentIntent.slots[PROJECT_SLOT];
}

function handler(event, context, callback) {
	const intentName = event.currentIntent.name;
	const sessionAttributes = event.sessionAttributes || {};
	const sessionProjectName = sessionAttributes[PROJECT_SLOT];
	const slotProjectName = getProjectNameFromSlot(event);

	if (!sessionProjectName && !slotProjectName) {
		// If neither session attribute or slot is populated then ask user for project name
		return callback(null, dialogActions.elicitSlot(sessionAttributes, event.currentIntent.name, event.currentIntent.slots, PROJECT_SLOT, { contentType: 'PlainText', content: 'What is the project name?' }))
	} else if (!slotProjectName && sessionProjectName) {
		// If slot is configured in session but not yet in slot
		// store it in slot variable and delegate back to Lex config
		const slots = Object.assign({}, event.currentIntent.slots);
		slots[PROJECT_SLOT] = sessionProjectName;

		return callback(null, dialogActions.delegate(sessionAttributes, slots))
	} else if (slotProjectName && !sessionProjectName) {
		// If slot is configured but not yet stored as a session
		// store it in session attributes and delegate back to Lex config
		sessionAttributes.ProjectName = slotProjectName;
		return callback(null, dialogActions.delegate(sessionAttributes, event.currentIntent.slots))
	}

	const intentHandler = INTENT_HANDLERS[intentName];

	if (!intentHandler) {
		throw new Error(`Intent name not recognised`);
	}

	intentHandler.handler(event, context, callback);
}

module.exports = {
  handler
};
