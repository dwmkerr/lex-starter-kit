#!/usr/bin/env bash

# check-dependencies.sh
#
# This script will check that the developer has the required tooling on their
# machine. It will exit with a code of 0 if the tools are present, and 1 if not.

# Write a message if DEBUG=1
debug () {
    if [ "$DEBUG" = "1" ]; then
        echo -e "debug: $1"
    fi
}

# Check that the AWS CLI is intalled.
debug "checking for aws cli..."
if command -v aws > /dev/null; then
    debug "aws cli is installed"
else
    debug "aws cli is not installed"
    echo "The AWS CLI is required:"
    echo "  https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html"
    exit 0
fi

# Check that jq is intalled.
debug "checking for jq..."
if command -v jq > /dev/null; then
    debug "jq is installed"
else
    debug "jq is not installed"
    echo "The 'jq' tool is required:"
    echo "  https://stedolan.github.io/jq/download/"
    exit 1
fi
