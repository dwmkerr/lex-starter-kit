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
		return callback(null, dialogActions.elicitSlot(sessionAttributes, event.currentIntent.name, event.currentIntent.slots, PROJECT_SLOT, { contentType: 'PlainText', content: 'What is the project name?' }))
	} else if (slotProjectName && !sessionProjectName) {
		sessionAttributes.ProjectName = slotProjectName;
		return callback(null, dialogActions.delegate(sessionAttributes, event.currentIntent.slots))
	}

	const handler = INTENT_HANDLERS[intentName];

	if (!handler) {
		throw new Error(`Intent name not recognised`);
	}

	handler.handler(event, context, callback);
}

module.exports = {
  handler
};
