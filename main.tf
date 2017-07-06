# AWS resources required for the chatbot. See:
# https://github.com/awslabs/aws-lex-convo-bot-example

variable "region" {
  description = "The region to deploy the cluster in. Must support lex."
  default = "us-east-1"
}

#  Setup the core provider information.
provider "aws" {
  region  = "${var.region}"
}

# A bucket which'll hold the lambda function code.
resource "aws_s3_bucket" "bucket-lambda-lex" {
  bucket = "lex-boilerplate"
  # Anyone can read the bucket.
  acl    = "public-read"

  tags {
    Name        = "Lex Boilerplate"
    Project     = "Lex"
  }
}

# A role for the lambda function.
resource "aws_iam_role" "role-lambda-lex" {
  name = "role-lambda-lex"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      }
    }
  ]
}
EOF
}

# The policy allowing us to invoke a lambda function.
resource "aws_iam_policy" "policy-invoke-lambda-function" {
  name        = "policy-invoke-lambda-function"
  path        = "/"
  description = "Policy to allow the invokation of a lambda function"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Effect": "Allow",
            "Resource": "*"
        }
    ]
}
EOF
}

# Attach the lambda invokation policy to the role.
resource "aws_iam_policy_attachment" "attach-invoke-lambda-function-to-lambda" {
  name       = "attach-invoke-lambda-function-to-lambda"
  roles      = ["${aws_iam_role.role-lambda-lex.name}"]
  policy_arn = "${aws_iam_policy.policy-invoke-lambda-function.arn}"
}

# The variables we output. Just enough to point to the bucket and reference
# the role.

# The region.
output "region" {
  value = "${var.region}"
}

# The role ARN for the lambda function.
output "role" {
  value = "${aws_iam_role.role-lambda-lex.arn}"
}

# The S3 bucket name.
output "bucket" {
  value = "${aws_s3_bucket.bucket-lambda-lex.bucket}"
}
