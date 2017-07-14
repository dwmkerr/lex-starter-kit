# lex-boilerplate

Oscarbot project for [The AWS Chatbot Challenge](https://aws.amazon.com/events/chatbot-challenge/).

The Slack Channel is: https://oscar-bot.slack.com

# Talking to Oscar

The quickest way to try out Oscar is to request an invite to the [OscarBot Slack Channel](https://oscar-bot.slack.com).

Oscar can provide all sorts of information about repositories, as well as doing things like opening issues. Some example interations are:

TODO

There is a complete list at:

TODO

# Developer Guide

This diagram shows the key steps for setup and development:

- ![Setup & Development Guide Diagram](./docs/setup-and-develop-commands.png)

## Environment Setup

Install:

- [The AWS CLI](https://aws.amazon.com/cli/)
- [jq](https://stedolan.github.io/jq/download/)

Ensure you are logged into the AWS CLI as a user with permissions to create Lambda Functions, Buckets, Roles, Policies and Lex Models.

Set the following environment variables:

| Variable | Usage |
|----------|-------|
| `OSCAR_BUCKET` | A name to use for the S3 bucket for Oscar. This must be unique across AWS, so try something like `oscarbot-<your name>` |
| `OSCAR_GITHUB_USERNAME` | The GitHub user to login as when performing queries. |
| `OSCAR_GITHUB_PASSWORD` | The GitHub password to login with when performing queries. |

You can now call:

```bash
make setup
```

Which will build the lambda function, bucket and policies.

## Circle CI

`circle.yml` will build changes on master and deploy to AWS (make sure you have set the Circle AWS key in the console)

## Chatting

- How many stars does my project have?
- How many issues does my project have?
- Can you open an issue for me?
- What was the last commit on my project?
- What was the last commit on dwmkerr/effective-shell?
- What are the issues for my project?

## Snappy Responses

If you want to provide some simple flavour text or a one-line response to a statement, you can use the [`snappyResponses.js`](./functions/oscarbot/snappyResponses.js) file.

Please note that even a one-line response will still need an intent. Put these intents in the [intents/conversational](./intents/conversational) folder to distinguish them from functional intents.

It is possible that intents are limited, and it is the case that a large number of intents can actually make it harder to determine intent, so be careful to to add too many.

## Useful Reading

- https://docs.aws.amazon.com/lex/latest/dg/slack-bot-association.html
