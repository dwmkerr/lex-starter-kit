//  Important! Each intent exported from this module *must* have a key which
//  matches an intent in an intent file.
module.exports = {
  SendMessage: require('./sendMessage'),
  WhatTime: require('./whatTime')
};
