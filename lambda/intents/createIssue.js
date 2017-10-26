const dialog = require('../dialog');
const config = require('../config');
const github = require('./github');
const session = require('../session');

function create(repository, title, message) {
  //  Grab our github config.
  const username = config.github.username;
  const password = config.github.password;

  //  Validate the config is present.
  if (!username) throw new Error('No GitHub username has been configured');
  if (!password) throw new Error('No GitHub password has been configured');

  //  Login and create the issue.
  return github.login(username, password)
    .then((token) => {
      return github.post(token, `/repos/${repository}/issues`, {
        title: title,
        body: message
      });
    });
}

function createIssue(event) {
  //  Grab the data from the slots.
  const repository = event.currentIntent.slots.GitHubRepository;
  const issueTitle = event.currentIntent.slots.GitHubIssueTitle;
  const issueContent = event.currentIntent.slots.GitHubIssueContent;

  //  Elicit slots if needed.
  if (!repository) return Promise.resolve(dialog.elicitSlot(event, 'GitHubRepository', 'What\'s the repository (e.g. org/repo)?'));
  if (!issueTitle) return Promise.resolve(dialog.elicitSlot(event, 'GitHubIssueTitle', 'What\'s the title of the issue?'));
  if (!issueContent) return Promise.resolve(dialog.elicitSlot(event, 'GitHubIssueContent', 'What\'s the content for the issue?'));

  //  Save the repository into the session for later use.
  session.saveSlotIntoSessionAttribute(event, 'GitHubRepository');

  //  Create the issue.
  return create(repository, issueTitle, issueContent)
    .then((result) => {
      //  Create the response.
      const url = result.body.html_url;
      const response = `I've created the issue! The link is '${url}'.`;
      return dialog.fulfilled(event, response);
    })
    .catch((err) => {
      console.error('An error occured creating an issue on GitHub.');
      console.error(err);
      return dialog.failed(event, 'Sorry, there was a problem talking to GitHub.');
    });
}

module.exports = createIssue;
