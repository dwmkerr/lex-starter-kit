const moment = require('moment');
const dialog = require('../dialog');

//  Reponds to a 'WhatDate' intent.
function whatDate(event) {
  
  //  Get the date, format it nicely.
  const date = moment().format('dddd, MMMM Do YYYY');

  //  Create a message for the user.
  const message = `The date is ${date}.`;

  //  Respond with the 'fulfilled' dialog action.
  return Promise.resolve(dialog.fulfilled(event, message));
}

module.exports = whatDate;
