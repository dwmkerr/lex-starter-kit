#!/usr/bin/env bash

# Abort on any error.
set -e

# Create bot from its json description.
# Usage:
#   deploy-bot us-east-1 ./lex/bot/oscar.json
function deploy-bot() {
    region=$1
    botFile=$2

    # Get the bot name.
    botName=`cat $botFile | jq -r .name`
    echo "Found bot '$botName' in '$botFile'..."

    cp $botFile $botFile.temp

    # Go through every intent in the bot, we're going to set it to the latest
    # published version.
    INTENTS=`cat $botFile | jq -r ".intents[].intentName"`
    for INTENT in $INTENTS; do

        # Get the versions, rip out the version number of the most recent one.
        INTENTVERSION=`aws lex-models get-intent-versions --name $INTENT --region $region | jq -r ".intents[-1].version"`
        echo "Updating $botName intent $INTENT to latest version ($INTENTVERSION)..."

        # Replace the version number in the intent.
        cp $botFile.temp $botFile.temp2
        cat $botFile.temp2 | jq --arg v "$INTENTVERSION" --arg i "$INTENT" '(.intents[] | select(.intentName == $i) | .intentVersion) |= $v' > $botFile.temp
        rm $botFile.temp2

    done

    # Check to see if we have the intent already.
    LATEST_VERSION=`aws lex-models get-bot-versions --name $botName --region $region | jq -r '.bots[0].version | select (.!=null)'`
    
    # Now update or create the bot, as required.
    if [ $LATEST_VERSION ]; then
        echo "Found '$botName' version '$LATEST_VERSION', updating..."
        CHECKSUM=`aws lex-models get-bot --name $botName --region $region --version-or-alias "$LATEST_VERSION" | jq -r .checksum`
        aws lex-models put-bot --region $region --name $botName \
            --cli-input-json "file://$botFile.temp" --checksum "$CHECKSUM"
    else
        # Write a bit o info and put the slot.
        echo "Creating '$botName' from '$botFile.temp'..."
        aws lex-models put-bot --region $region --name $botName \
            --cli-input-json "file://$botFile.temp"
    fi

    # Now we need to wait until the latest version of the bot changes status
    # from 'BUILDING' to 'READY'.
    STATUS="BUILDING"
    until [ "$STATUS" = "READY" ] 
    do
        sleep 1
        STATUS=`aws lex-models get-bot --name $botName --region $region --version-or-alias "$LATEST_VERSION" | jq -r .status`
        echo "$botName build status is: $STATUS"
    done

    # Grab the latest version and publish.
    CHECKSUM=`aws lex-models get-bot --name $botName --region $region --version-or-alias '$LATEST' | jq -r .checksum`
    echo "Publishing $botName with checksum $CHECKSUM..."
    aws lex-models create-bot-version --name $botName --region $region --checksum "$CHECKSUM"

    # Cleanup the temporary bot file.
    rm $botFile.temp

}

# Allows to call a function based on arguments passed to the script
$*
