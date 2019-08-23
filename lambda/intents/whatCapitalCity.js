const dialog = require('../dialog');
const countries = require('countryjs');
const Fuse = require('fuse.js');

async function whatCapitalCity(event) {
  //  Grab the data from the slots.
  const country = event.currentIntent.slots.Country;

  //  Elicit slots if needed.
  if (!country) return dialog.elicitSlot(event, 'Country', 'What is the country you want to know the capital city of?');

  //  Try and find the country with a fuzzy text search.
  const options = {
    keys: ['name', 'nativeName'],
    threshold: 0.4, // should be _fairly_ close to a known country...
  };
  const fuse = new Fuse(countries.all(), options);
  const results = fuse.search(country);

  //  If we didn't find a result, bail.
  if (results.length === 0) {
    return dialog.failed(event, `I can't find a country called ${country}.`);
  }

  //  If we found at leats one city, go for it.
  const { name, capital } = results[0];
  if (results.length > 0) return dialog.fulfilled(event, `The capital of ${name} is ${capital}.`);
}

module.exports = whatCapitalCity;
