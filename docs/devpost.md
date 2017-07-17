## Inspiration


## What it does
Oscar is a chatbot that interfaces neatly with open-source projects on Github. For those times, when you want to quickly view the latest issues that have been created, the open pull requests, or even open an issue from either Slack or the command line, Oscar is your best friend.

## How we built it
We built it using a single lambda function, which would interface to the specific logic to deal with each intent, interfacing with the Github graphql API to query and return information.

A full setup and development pipeline was constructed:

![Pipeline](https://raw.githubusercontent.com/mindmelting/lex-oscarbot/master/docs/setup-and-develop-commands.png)

## Challenges we ran into
* Lex slots are challenging to get to grips with, and also required a considerable amount of training values for it to start to recognise what a Github project name looks like

## Accomplishments that we're proud of
* The CI/CD pipeline
** As soon as we commit a new or updated intent or slot type to the repository, CircleCI will deploy and update Lex via the CLI

## What we learned
* How AWS Lex works as a platform
* How many different ways there are for people to say the same thing

## What's next for OscarBot
* We will look to gather even more data on what other intents would be useful
* Authentication for private repositories