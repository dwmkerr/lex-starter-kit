# lex-boilerplate

Boilerplate project for [The AWS Chatbot Challenge](https://aws.amazon.com/events/chatbot-challenge/).

The Slack Channel is: https://dmlex.slack.com

## Dependencies

- [The AWS CLI](https://aws.amazon.com/cli/) - make sure you are logged in!
- [Terraform](https://www.terraform.io/intro/getting-started/install.html) - for quick infra setup.

## Initial setup

First build the lambda function code:

```bash
make build
```

You'll need some basic AWS infrastructure (a bucket and policy). Set it up with:

```bash
make infra-up
```

Now setup the bot. This step cannot yet be automated as there are no Terraform resources available for Lex.

1. Go the [Lex Console Bot Create Page](https://console.aws.amazon.com/lex/home?region=us-east-1#bot-create:). US East is the only supported region.
2. Choose 'Custom Bot', with a sensible name. 'Child Directed' is 'No'. Hit 'Create'.

## Deploying
Running the following will update the function code on AWS.

```bash
make deploy
```

## Circle CI

`circle.yml` will build changes on master and deploy to AWS (make sure you have set the Circle AWS key in the console)

## Useful Reading

- https://docs.aws.amazon.com/lex/latest/dg/slack-bot-association.html
