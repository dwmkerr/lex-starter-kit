const chalk = require('chalk');
const debug = require('debug')('oscar');
const exec = require('child_process').exec;
const readline = require('readline');
const config = require('./config');

/**
 * createUserNameForSession - creates a random username suitable for the cli
 session.
 *
 * @returns - a username for the session.
 */
function createUserNameForSession() {
  const sessionNumber = Math.floor(Math.random() * (100000) + 1);
  return `User${sessionNumber}`;
}

/**
 * executeCommand - runs a process and waits for it to terminate. Returns the 
 output of the command as a string.
 *
 * @param command - the shell command to execute.
 * @returns - A promise which resolves with the result of the command as a
 string.
 */
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const childProcess = exec(command);
    childProcess.stdout.on('data', (data) => { stdout += data; });
    childProcess.stderr.on('data', (data) => { stderr += data; });
    childProcess.on('close', (code) => {
      //  If we have a non-zero error code, reject. Otherwise resolve with the
      //  console output.
      if (code !== 0) {
        const error = new Error(`An error occured running the command: ${command}`);
        error.stderr = stderr;
  
        //  If we're in debug mode, log details.
        debug(`Error running command: ${command}`);
        debug(`Process Exit Code: ${code}`);
        debug(`Stderr Output: ${stderr}`);

        return reject(error);
      }
      resolve(stdout);
    });
  });
}

function promptOscar() {
  return `${chalk.blue('oscar')} > `;
}

function promptUser() {
  return `${chalk.blue('me')}    > `;
}

function cli() {
  //  Start the program with some nice output.
  console.log('Hello, I am Oscar 🤖');
  console.log('');
  console.log('You chat to me about your GitHub project!');
  console.log('');
  console.log(`${promptOscar()}Hi! What can I help you with?`);

  //  Create a username for the session.
  const userName = createUserNameForSession();

  //  Create a readline interface (i.e. an interactive prompt).
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: promptUser()
  });

  rl.on('line', (line) => {

    //  Create the command.
    const command = `aws lex-runtime post-text --bot-name "${config.OSCAR_CLI_BOT}" --bot-alias '${config.OSCAR_CLI_BOT_ALIAS}' --region "${config.OSCAR_CLI_REGION}" --user-id "${userName}" --input-text "${line}"`;

    //  Excecute the command.
    executeCommand(command)
      .then((response) => {
        //  Decode and write the response.
        const val = JSON.parse(response);
        console.log(`${promptOscar()}${val.message}`);

        //  Run the prompt again.
        rl.prompt();
      })
      .catch((error) => {
        console.log(`\n${chalk.red('An error occurred connecting to the server. Run with DEBUG=oscar set for details.')}\n`);
        process.exit(1);
      });

  }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
  });

  //  Start the interactive prompt.
  rl.prompt();
}

module.exports = cli;
