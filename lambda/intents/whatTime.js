const moment = require('moment-timezone');
const dialog = require('../dialog');
const config = require('../config');

//  Reponds to a 'WhatTime' intent.
function whatTime(event) {
  
  //  Get the time, format it nicely.
  const time = moment().tz(config.timezone).format('h:mm a z');

  //  Create a message for the user.
  const message = `The time is ${time}.`;

  //  Respond with the 'fulfilled' dialog action.
  return Promise.resolve(dialog.fulfilled(event, message));
}

module.exports = whatTime;
