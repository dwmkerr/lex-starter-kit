# test-script

Follow this test script to manually test Oscar.

**Flavour**

Q. "do you obey Asimov's laws"
A. ""

**Count Issues**

Q. "how many issues does mindmelting/lex-oscarbot have?"
A. Jay-Z has 99 problems but lex-oscarbot only has 9!"

- Check the number of issues is correct.

**Count Open PRs**

Q. "How many PRs does the project have?"
A. "Lex-oscarbot has 1 open pull requests."

- The project from the previous question should be remembered.
- Check the number of PRs is correct.

**Describe Last Commit**

Q. "what was the last commit on dwmkerr/spaceinvaders?"
A. "dwmkerr was the most recent person to comment 3 years ago on dwmkerr/spaceinvaders and they said Updated error handling for sounds."

- The question mark shouldn't bomb oscar.
- The project should've *changed* to `dwmkerr/spaceinvaders` without eliciting input.

**Fork Project**

FAILS!

**Star Project**

Q. "can you star dwmkerr/anglar-modal-service?"
A. "What's your GitHub username?"
Q. oscarbotchallenge
A. What's your GitHub password? (I need it to add the star, but I'll forget it straight after).
Q. <enter oscarbotchallenge password>
A. I'm going to star _dwmkerr/angular-modal-service_ on behalfof _oscarbotchallenge_ is that OK?
Q. ok
A. I've starred dwmkerr/angular-modal-service for you. I laid down a few tags while I was there too.

- Check the star is added.

**Unstar project**

```
me    > can you unstar my project
oscar > What's your GitHub username?
me    > oscarbotchallenge
oscar > What's your GitHub password? (I need it to remove the star,but I'll forget it straight after).
me    > LNbY,CXXwm9Y
oscar > I'm going to unstar _dwmkerr/angular-modal-service_ on behalf of _oscarbotchallenge_ is that OK?
me    > no
```

- Should not fail.
- Should not remove star.
