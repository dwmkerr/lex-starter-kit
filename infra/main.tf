variable "region" {
  description = "The region to deploy the cluster in, e.g: us-east-1."
}

#  Setup the core provider information.
provider "aws" {
  region  = "${var.region}"
}

# A bucket which'll hold the lambda function code.
resource "aws_s3_bucket" "lambda-bucket" {
  bucket = "lex-boilerplate"
  acl    = "private"

  tags {
    Name        = "Lex Boilerplate"
    Project     = "Lex"
  }
}
