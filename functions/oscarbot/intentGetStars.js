const dialogActions = require('utils/dialogActions');

function handler(event, context, callback) {
	const projectName = event.currentIntent.slots.ProjectName;

	if (!projectName) {
		callback(null, dialogActions.elicitSlot(event.sessionAttributes, event.currentIntent.name, event.currentIntent.slots, 'ProjectName', 'What is the project name?'))
	} else {
		callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', { contentType: 'PlainText',
       content: 'Your project has 10 stars' }));
	}
};

module.exports = {
  handler
};
