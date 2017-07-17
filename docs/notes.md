## Observations on Lex

Lex has no sensible way of eliciting session variables.

Lex struggles with certain inputs. For example, `ProjectName` won't take special characters. It seems that training this can be partially solved by adding special characters in the example values.

It would be good to have a CLI which allows you to just talk to oscar. If you are in a git folder it could send a session variable for the project, giving you a 'flow friendly' way to interface.

We are essentially just providing a natural language interface over a very large API, which makes things hard. Image:

- How many controbutors?
- Top contributor?
- How many contributors this week?

