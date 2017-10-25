const debug = require('debug')('oscar');

function logIncomingEvent(event) {
  const intent = event && event.currentIntent && event.currentIntent.name;
  const user = event && event.userId;
  const message = `Incoming intent '${intent}' from user '${user}'`;
  debug(message);
}

function logOutgoingResponse(err, event) {
  if (err) {
    //  If we have an error, log it...
    debug(`Preparing to return err: ${err}`);
  } else {
    //  ...otherwise log basic event details.
    const type = event && event.dialogAction && event.dialogAction.type;
    const message = `Responding with dialog action type '${type}'`;
    debug(message);
  }
}

function wrapCallback(callback) {
  return (err, event) => {
    logOutgoingResponse(err, event);
    return callback(err, event);
  };
}

module.exports = {
  logIncomingEvent,
  logOutgoingResponse,
  wrapCallback
};
