const moment = require('moment');
const dialog = require('../dialog');

//  Reponds to a 'WhatTime' intent.
function whatTime(event) {
  
  //  Get the time, format it nicely.
  const time = moment().format('h:mm a');

  //  Create a message for the user.
  const message = `The time is ${time}.`;

  //  Respond with the 'fulfilled' dialog action.
  return Promise.resolve(dialog.fulfilled(event, message));
}

module.exports = whatTime;
