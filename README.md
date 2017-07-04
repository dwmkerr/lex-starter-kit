# lex-boilerplate

## Initial setup

You will require an S3 bucket to upload your lambda function to, and a policy to attach to the lambda function. These are configured in the makefile.

```bash
make setup
```

This command will build the function, zip the code and node_modules, upload to S3 and create the function in AWS Lambda.

## Deploying
Running the following will update the function code on AWS.

```bash
make deploy
```

## Circle CI

`circle.yml` will build changes on master and deploy to AWS (make sure you have set the Circle AWS key in the console)
