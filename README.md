# Lex Starter Kit
TODO Circle TODO CodeCode

> Build a chatbot with AWS Lex and Lambda in minutes!

This project is a template quickly creating chatbox using AWS Lex and Lambda.

It is based on [lex-oscarbot](https://github.com/mindmelting/lex-oscarbot), a chatbot built for the [AWS Chatbot Challenge] by [dwmkerr]() and [mindmelting]().

- [Quick Start](#quick-start)
- [Developer Guide](#developer-guide)
	- [Environment Setup](#environment-setup)
	- [Useful Commands](#useful-commands)
	- [Circle CI](#circle-ci)
	- [Useful Reading](#useful-reading)

# Quick Start

TODO

# Developer Guide

The project structure is:

```
├── aws           # some aws resources used in setup
├── lambda        # lambda function and tests
├── lex           # slots and intent json files
├── oscar-cli     # the oscar cli
└── scripts       # scripts used by the makefile
```

This diagram shows the key steps for setup and development:

![Setup & Development Guide Diagram](./docs/setup-and-develop-commands.png)

## Environment Setup

Install:

- [The AWS CLI](https://aws.amazon.com/cli/)
- [jq](https://stedolan.github.io/jq/download/)

Ensure you are logged into the AWS CLI as a user with permissions to create Lambda Functions, Buckets, Roles, Policies and Lex Models.

Set the following environment variables:

| Variable | Usage |
|----------|-------|
| `BUCKET` | A name to use for the S3 bucket for Oscar. This must be unique across AWS, so try something like `oscarbot-<your name>` |
| `OSCAR_GITHUB_USERNAME` | The GitHub user to login as when performing queries. |
| `OSCAR_GITHUB_PASSWORD` | The GitHub password to login with when performing queries. |
| `DEBUG=oscar` | Optional. Enables debug output (we use the [debug](https://www.npmjs.com/package/debug) module. |

You can now call:

```bash
make setup
```

Which will build the lambda function, bucket and policies.

## Deploying Changes

If you change the lambda function, slots, intents or bot, just call:

```bash
make deploy
```

This will rebuild the lambda function and redeploy it. It will also rebuild and publish all slots, intents and the bot.

## Useful Commands

Here are some commands you can run to help work with the project:

| Command | Usage |
|---------|-------|
| `make build` | Builds the lamba function and zips it up locally. |
| `make test` | Runs the unit tests. |
| `make lint` | Lints the code. |
| `make setup` | Sets up your AWS resources. First time setup only. |
| `make deploy` | Deploys the code, slots and intents. |
| `make utterances` | Helper to print out all supported utterances. Useful when building docs. |
| `npm run test:debug` | Runs tests with the Chrome Inspector. |
| `npm run coverage` | Runs tests, generating a coverage report. |

## The CLI

If you have the AWS CLI setup with access to the bot, you can actually chat using the CLI. First, build and link the CLI with:

```bash
make cli
```

Then just run the `oscar` command to chat!

```
$ oscar
Hello, I am Oscar 🤖

You chat to me about your GitHub project!

oscar > Hi! What can I help you with?
me    > What projects am I working on?
```

## Circle CI

`circle.yml` will build changes on master and deploy to AWS (make sure you have set the Circle AWS key in the console).

## Testing

The bulk of the tests work by creating a chat event and passing it to the lambda function. This means it will test the *intent* but not the natural language processing.

A good example test to get learn from is [intentDescribeLastCommit.js](oscarbot/intentDescribeLastCommit.js).

## Useful Reading

- https://docs.aws.amazon.com/lex/latest/dg/slack-bot-association.html
