#!/usr/bin/env bash

# Abort on any error.
set -e

# Deploy a lambda function for the bot.
# Usage:
#   deploy-lambda us-east-1 lex-starter artifacts/lex-starter.zip
function deploy-lambda() {
    region=$1
    functionName=$2
    functionPath=$3
    variables=$4

    aws lambda update-function-code \
		--region ${region} \
		--function-name ${functionName} \
        --zip-file fileb://${functionPath}

	aws lambda update-function-configuration \
		--region ${region} \
		--function-name ${functionName} \
		--environment="Variables={${variables}}"
}

# Allows to call a function based on arguments passed to the script
$*
