//  Important! Each intent exported from this module *must* have a key which
//  matches an intent in an intent file.
module.exports = {
  CreateIssue: require('./createIssue'),
  SendMessage: require('./sendMessage'),
  WhatTime: require('./whatTime'),
  WhatDate: require('./whatDate'),
  WhatCapitalCity: require('./whatCapitalCity'),
};
