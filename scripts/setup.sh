#!/usr/bin/env bash

# setup.sh
#
# This script will create everything needed to run the chatbot from scratch.
# This means:
#   Roles
#   Policies
#   The Bot
#   The Lambda Function
#
# Parameters are:
#   - region
#   - lambda functino name
#   - runtime
#
# Example:
#
#   ./setup.sh us-east-1 lex-sample nodejs10.x
if [ $# -lt 3 ]; then
    echo "Usage: setup.sh region-name function-name runtime"
    exit 1
fi
region="$1"
function_name="$2"
runtime="$3"

# Write a message if DEBUG=1
debug () {
    if [ "$DEBUG" = "1" ]; then
        echo -e "debug: $1"
    fi
}

debug "setting up:"
debug "  region: ${region}"
debug "  function_name: ${function_name}"
debug "  runtime: ${runtime}"

# Create the role and set the policy.
role_name="${function_name}-role"
policy_name="${function_name}-policy"
debug "creating role '${role_name}'..."
aws iam create-role --role-name "${role_name}" --assume-role-policy-document file://aws/lambda-policy-doc.json
debug "creating policy '${policy_name}'..."
aws iam put-role-policy --role-name "${role_name}" --policy-name "${policy_name}" --policy-document file://aws/policy.json
debug "done, waiting 10s for creation to complete..."

# Roles take a while to setup, this could be better...
sleep 10 

# Get the account ID.
debug "getting account id..."
account_id=`aws sts get-caller-identity --output text --query 'Account'`
debug "account id is '${account_id}'"

debug "creating function in '${function_name}' in region '${region}'..."
aws lambda create-function \
    --region "${region}" \
    --function-name "${function_name}" \
    --runtime "${runtime}" \
    --handler index.handler \
    --environment="Variables={DEBUG=lex-starter-kit}" \
    --role "arn:aws:iam::${account_id}:role/${role_name}" \
    --zip-file fileb://artifacts/${function_name}.zip
debug "setup complete..."
