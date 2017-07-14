const en = require('./en.json');

function interpolateString(str, meta) {
  return Object
    .keys(meta)
    .reduce((a, b) => {
      return a.replace(`$\{${b}}`, meta[b]);
    }, str);
}

function getString(key, meta = {}) {
  return en[key] && interpolateString(en[key], meta);
}

module.exports = getString;
