# lex-boilerplate

Oscarbot project for [The AWS Chatbot Challenge](https://aws.amazon.com/events/chatbot-challenge/).

The Slack Channel is: https://oscar-bot.slack.com

## Dependencies

- [The AWS CLI](https://aws.amazon.com/cli/) - make sure you are logged in!
- [Terraform](https://www.terraform.io/intro/getting-started/install.html) - for quick infra setup.

## Initial setup

You'll need some basic AWS infrastructure (a bucket and policy). Set it up with:

```bash
make infra-up
```

You will now need to build the lambda function, upload to S3 and create the lambda function in AWS. Set this up with:

```bash
make setup
```

Now setup the bot. This step cannot yet be automated as there are no Terraform resources available for Lex.

1. Go the [Lex Console Bot Create Page](https://console.aws.amazon.com/lex/home?region=us-east-1#bot-create:). US East is the only supported region.
2. Choose 'Custom Bot', with a sensible name. 'Child Directed' is 'No'. Hit 'Create'.

## Environment Variables

The following environment variables must be set, for normal execution and for tests.

| Variable | Usage |
|----------|-------|
| `GITHUB_USERNAME` | The GitHub user to login as when performing queries. |
| `GITHUB_PASSWORD` | The GitHub password to login with when performing queries. |

## Deploying

Running the following will update the function code on AWS.

```bash
make deploy
```

## Circle CI

`circle.yml` will build changes on master and deploy to AWS (make sure you have set the Circle AWS key in the console)

## Chatting

- How many stars does my project have?
- How many issues does my project have?
- Can you open an issue for me?
- What was the last commit on my project?
- What was the last commit on dwmkerr/effective-shell?

## Developer Guide

### Snappy Responses

If you want to provide some simple flavour text or a one-line response to a statement, you can use the [`snappyResponses.js`](./functions/oscarbot/snappyResponses.js) file.

Please note that even a one-line response will still need an intent. Put these intents in the [intents/conversational](./intents/conversational) folder to distinguish them from functional intents.

It is possible that intents are limited, and it is the case that a large number of intents can actually make it harder to determine intent, so be careful to to add too many.

## Useful Reading

- https://docs.aws.amazon.com/lex/latest/dg/slack-bot-association.html
