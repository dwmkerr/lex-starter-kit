# test-script

Follow this test script to manually test Oscar.

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

```
oscar > Hi! What can I help you with?
me    > fork a project
oscar > OK! What is the repository name?
me    > dwmkerr/spaceinvaders
oscar > What's your GitHub username?
me    > oscarbotchallenge
oscar > What's your GitHub password? (I need it to fork for you, but I'll forget it straight after).
me    > <Password>
oscar > I'm going to fork _dwmkerr/spaceinvaders_ on behalf of _oscarbotchallenge_ is that OK?
me    > ok
oscar > I've started forking _dwmkerr/spaceinvaders_ for you to _oscarbotchallenge/spaceinvaders_, it can sometimes take a few minutes to complete.
me    >
```

**Get Stars**

```
me    > how many stars does the project have
oscar > If spaceinvaders keeps stealing all the stars, the night sky will soon be empty! It currently has 76 stars
```

- Check the number of stars.

**My Open Issues**

```
me    > What issues have I opened
oscar > What's your GitHub username?
me    > dwmkerr
oscar > Your top five updated issues are:
 _Make a video of the dev process_ - https://github.com/mindmelting/lex-oscarbot/issues/111
 _Intermittent failure of the 'clears connections on close' test_ - https://github.com/hapijs/hapi/issues/3503
 _Intents: Flavour_ - https://github.com/mindmelting/lex-oscarbot/issues/108
 _Update the 'abortStatement' and 'clarifyPrompts'_ - https://github.com/mindmelting/lex-oscarbot/issues/106
 _When GitHub API Calls Fail, show an error message_ - https://github.com/mindmelting/lex-oscarbot/issues/104
```

- Check the issues look valid.

**Open Issue**

Restart oscar.

```
oscar > Hi! What can I help you with?
me    > open issue
oscar > OK! What is the repository name?
me    > mindmelting/lex-oscarbot
oscar > Sure, I'll need a title for that, what do you want to call it?
me    > Test Issue
oscar > Great, I need you add a description for Test Issue
me    > Here is some content
oscar > I just want to confirm that you want to open an issue titled *Test Issue* and with description _Here is some content_?
me    > yes
oscar > Thanks for confirming, the issue is now open and it's located at undefined
me    >
```

- Ensure the issue link is valid FAILED.
- Ensure the issue details are valid.

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

**Three Laws**

```
me    > do you obey asimov's laws
oscar > I only have the CPU to support two of the three laws at any one time.
```

**Top Issues**

Restart oscar.

```
oscar > Hi! What can I help you with?
me    > what issues does mindmelting/lex-oscarbot have
oscar > OK, here we go! The top issues for lex-oscarbot are:
 _Logging: In / Out_ - https://github.com/mindmelting/lex-oscarbot/issues/114
 _Make a video of the dev process_ - https://github.com/mindmelting/lex-oscarbot/issues/111
 _Intents: Flavour_ - https://github.com/mindmelting/lex-oscarbot/issues/108
 ```

- Should show three most recent issues.

**Unstar project**

Restart oscar.

```
me    > unstar a project
oscar > OK! What is the repository name?
me    > dwmkerr/spaceinvaders
oscar > What's your GitHub username?
me    > oscarbotchallenge
me    > oscar > What's your GitHub password? (I need it to remove the star, but I'll forget it straight after).
me    >
oscar > I'm going to unstar _dwmkerr/spaceinvaders_ on behalf of _oscarbotchallenge_ isthat OK?
me    > no
oscar > Ok, I will not unstar the repository.
```

- Should not remove star.

**What are my most popular projects**

Restart oscar.

```
oscar > Hi! What can I help you with?
me    > what are my most popular projects
oscar > What's your GitHub username?
me    > dwmkerr
oscar > Your three most popular repositories are:
 - angular-modal-service (588 stars)
 - sharpshell (348 stars)
 - sharpgl (227 stars)
 ```

 - Should show your three most popular projects.
 - Should not elicit any other intents.

**WhatCanIAskYou**

```
oscar > Hi! What can I help you with?
me    > what can I ask you
oscar > You can ask me things like:
 - How many issues does the project have
 - How many PRs does the project have
 - What was the last commit on my project
 - How many stars does the project have
 - I would like to open an issue
 - List the top issues for my project
 - List the issues
 - What can I ask you
 - What projects am I working on
 - What issues have I opened
 - Star a project
 - Unstar a project
```

**WhatProjectsAmIWorkingOn**

```
oscar > Hi! What can I help you with?
me    > what projects is dwmkerr working on
oscar > You own 71 repositories and have contributed to 22 repositories.
```

**What's Trending**

```
oscar > Hi! What can I help you with?
me    > what's trending on github
oscar > The following repos are trending in the last seven days:
 - Kristories/awesome-guidelines (1372 stars)
 - Spandan-Madan/DeepLearningProject (734 stars)
 - cdflynn/turn-layout-manager (426 stars)
 - woxingxiao/SlidingUpPanelLayout (316 stars)
 - wangchunming/2017hosts (303 stars)
 - square/RxIdler (189 stars)
 - vulnersCom/burp-vulners-scanner (177 stars)
 - yo-op/sketchcachecleaner (169 stars)
 - clauswilke/ggjoy (166 stars)
 - nadoo/glider (154 stars)
```
