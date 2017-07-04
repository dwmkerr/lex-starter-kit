# lex-boilerplate

## Dependencies

- [The AWS CLI](https://aws.amazon.com/cli/) - make sure you are logged in!
- [Terraform](https://www.terraform.io/intro/getting-started/install.html) - for quick infra setup.

## Initial setup

You'll need some basic AWS infrastructure (a bucket and policy). Set it up with:

```bash
make infra-up
```

Now that the policy and bucket is setup, you can create the lambda functions:

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
