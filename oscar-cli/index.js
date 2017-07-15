const chalk = require('chalk');
const exec = require('child_process').exec;
const readline = require('readline');

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
  return new Promise((resolve) => {
    let result = '';
    const childProcess = exec(command);
    childProcess.stdout.on('data', (data) => { result += data; });
    childProcess.on('close', (data) => { console.log(`close: $data`); resolve(result); });
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
    const command = `aws lex-runtime post-text --bot-name oscarbot --bot-alias Dev --user-id "${userName}" --input-text "${line}"`;

    //  Excecute the command.
    executeCommand(command)
      .then((response) => {
        //  Decode and write the response.
        const val = JSON.parse(response);
        console.log(`${promptOscar()}${val.message}`);

        //  Run the prompt again.
        rl.prompt();
      });

  }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
  });

  //  Start the interactive prompt.
  rl.prompt();
}

module.exports = cli;
