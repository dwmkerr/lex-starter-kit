- [ ] Plan presentation structure
- [ ] Design a nice slot bot
- [ ] Build intents and slots
- [ ] Update README
- [x] Make OscarBot.json generic
- [ ] Design a very simple intent (what's the time?)
- [ ] Traiom 
- [ ] Stretch: CLI
- [ ] Update code to have a basic structure with intent files
- [ ] Avoid session code?
- [ ] Remove the need for an S3 bucket
- [ ] Move the 'exists' functions into a script,
- [ ] Update the 'exists' script to check we are logged in.
- [ ] looks like lint isn't working (break handler, check lint)
- [ ] coverage is not written to the artifacts

# The Presentation

0. Start by explaining the architecture and concepts for lex.
 - Concepts (Bots, Intents, Slots, Lex, Lambda)
1. Start with the infrastructure as code.
 - Architecture
2. Show the AWS resources created.

## Bots

3. Build a Bot object, with no intents.
 - Name, Description, Locale, Voice, Child Directed, TTL
 - Clarification Prompt, Abort Statement
4. Show what happens with no intents (i.e. the 'no response' interaction).

## Intents

4. Add a very simple intent (what's the time?)
5. Show what happens when you give it invalid input (e.g. what time is it?)
6. Train the bot with the intent.
7. Describe intent lifecycle.

## Slots

1. Add a basic input
2. Add an intent which uses the input
 - Text Sarah intent
3. Show it in action
4. Add a 'standard' input

## Sessions

1. Show sessions in action.

## CLI

## Slack
