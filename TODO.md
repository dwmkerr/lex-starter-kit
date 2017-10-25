- [ ] Plan presentation structure
- [ ] Build intents and slots
- [ ] Update README
- [ ] Make OscarBot.json generic
- [ ] Design a very simple intent (what's the time?)
- [ ] Traiom 
- [ ] Stretch: CLI
- [ ] Update code to have a basic structure with intent files
- [ ] Avoid session code?
- [ ] Remove the need for an S3 bucket

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

## Slots

1. Add a basic input
2. Add an intent which uses the input
3. Show it in action
4. Add a 'standard' input

## CLI

## Slack
