#!/usr/bin/env bash

# Abort on any error.
set -e

# Destroy a bot from its json description.
# Usage:
#   destroy-bot us-east-1 ./lex/bot/Bot.json
function destroy-bot() {
    region=$1
    botFile=$2

    # Get the bot name.
    botName=`cat $botFile | jq -r .name`
    echo "Found bot '$botName' in '$botFile'..."

    echo "Deleting $botName..."
    aws lex-models delete-bot --name $botName --region $region
}

# Allows to call a function based on arguments passed to the script
$*
