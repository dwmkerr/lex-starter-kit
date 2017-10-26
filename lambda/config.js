//  Basic config for the project. Fields can be overwritten with environment
//  variables if needed.
const config = {
  twilio: {
    sid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  github: {
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_PASSWORD,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  }
};

module.exports = config;
