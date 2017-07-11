const assert = require('assert');
const login = require('./login');
const config = require('../../config');

describe('Github login', () => {
  it('Should respond with a token', (done) => {
  	login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, {})
  		.then((token) => {
  			assert(token.match(/.+/));
  			done();
  		});
  });

  it('Should set sessionAttribute token', (done) => {
  	const event = {};

  	login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
  		.then((token) => {
  			assert.equal(event.sessionAttributes.GithubToken, token);
  			done();
  		});
  });

  it('Should use sessionAttribute token', (done) => {
  	const event = {
  		sessionAttributes: {
  			GithubToken: '123abc'
  		}
  	};

  	login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
  		.then((token) => {
  			assert.equal(token, '123abc');
  			done();
  		});
  });

  it('Should throw error with no username or password', () => {
  	assert.throws(login, Error);
  });
});
