## Inspiration

Our enthusiasm for working together as a team on a new open source project was the inspiration for Oscar.

We loved the idea of an 'open source buddy' who would help you out while you are working on projects. Oscar would be part of the team, helping out by giving information on your project and helping you with common tasks like opening issues, forking or checking for pull requests.

## What it does

Oscar is a chatbot that interfaces neatly with open-source projects on Github. You can bring Oscar into your team channel on Slack and he'll help you get information on your projects and perform common tasks. For terminal nerds, you can even run Oscar through a command line interface so that you never have to leave your terminal window!

![Oscar In Action in Slack](https://raw.githubusercontent.com/mindmelting/lex-oscarbot/e205856a8e03a8d354c26e9707cae1fe94c1d7e0/docs/screenshots/slack.jpg)

![Oscar In Action in a Terminal](https://raw.githubusercontent.com/mindmelting/lex-oscarbot/e205856a8e03a8d354c26e9707cae1fe94c1d7e0/docs/screenshots/terminal.jpg)

Oscar can:

- Open Issues
- Get project statistics
- Check for stars or pull requests
- Find out what the top issues are
- Star or unstar projects
- Find out what is trending

And a whole lot more!

## How we built it

Oscar runs as a single lambda function. When a request comes in, we match it to an 'intent function'. Most intent functions interact with GitHub in some way, calling either the REST API or the new GraphQL API.

Data which is relevant to a user for more than one intent, such as the project you are currently discussing, lives in the session. Other data is elicited as required in the intent function.

A full setup and development pipeline was constructed:

![Pipeline](https://raw.githubusercontent.com/mindmelting/lex-oscarbot/master/docs/setup-and-develop-commands.png)

This makes the development experience with Oscar very straightforward. For example, to add a new intent:

1. Add any slots you need into the `lex/slots` folder
2. Add a new intent with name `WhateverYouLike` into the `lex/intents` folder
3. Create a new intent function, making sure to call it when we receive the `WhateverYouLike` intent
4. Add the intent `WhateverYouLike` to the bot in the `lex/bot` folder
5. Run `make deploy`

That's it! The scripts will create any new slots needed, or update them if you changed them. It'll create the new intent, publish it and rebuild and publish the bot. You don't need to do any work in the AWS console.

When the `make deploy` command completes, your bot is ready. Just run the `oscar` command to start chatting to Oscar (run `make cli` if you haven't built the CLI yet).

## Challenges we ran into

* Lex slots are challenging to get to grips with, and also required a considerable amount of training values for it to start to recognise what a Github project name looks like.
* It is very difficult to set up slots which can have wildly varied inputs. For example, a slot which might contain a description for a new issue might be a few characters or many dozens of words.
* Context can be difficult to maintain. A user might ask 'how many issues has my project got', then ask 'and how many stars?'. In between the two intents we need to preserve the project they are working with.
* The biggest challenge is that Oscar is essentially a natural language interface to a very large API. The number of things people *could* ask Oscar is huge, because his purpose is very broad.

## Accomplishments that we're proud of

* We actually used Oscar while developing him. When we found bugs, we'd raise issues by chatting to Oscar!
* The 'conversational' intents, which add a little flavour, and were added after seeing what random things friends asked the bot.
* The testing. We pick up most bugs very quickly in our unit tests.
* The deployment scripts, which automatically handle creating, updating, versioning and publishing slots, intents and bots.
* The CI/CD pipeline and `make` commands, which make the developer experience smooth.
* The CLI, which provides a very fast way to interact with Oscar.

## What we learned

* Lots about how AWS Lex works as a platform!
* How many different ways there are for people to say the same thing :|
* How difficult it is to really anticipate how people will interact with a bot.
* That you can still apply good old test-driven development patterns to things like bots...
* ...but you still need a lot of manual testing to cover the different ways people speak!

## What's next for OscarBot

* We've got a [big backlog of intents](https://github.com/mindmelting/lex-oscarbot/issues) to add!
* Creating a 'start kit' version of the project so that other devs can leverage the CI/CD and test patterns to bootstrap their own projects quickly.
* We'd like to find a way to make authentication seamless, so Oscar can easily do things on your behalf (without requesting credentials).
* Moving the bulk of the code to promises rather than callbacks, to make things a little more consistent.
