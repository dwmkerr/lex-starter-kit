//  Basic config for the project. Fields can be overwritten with environment
//  variables if needed.
const config = {
  GITHUB_CLIENT_ID: 'e0b1671ff764de482212',
  GITHUB_CLIENT_SECRET: '8f77dcfd6a807cff38ac558400c859f240806071',
  GITHUB_USERNAME: process.env.OSCAR_GITHUB_USERNAME || 'oscarbotchallenge',
  GITHUB_PASSWORD: process.env.OSCAR_GITHUB_PASSWORD
};

module.exports = config;
