#!/usr/bin/env bash

# Abort on any error.
set -e

# If we don't have any files in a glob, give an empty array (not a wildcard).
shopt -s nullglob

# Create slots from a folder.
# Usage:
#   deploy-slots us-east-1 ./folder/**/*.json
function deploy-slots() {
    region=$1
    shift 1
    search=$*

    # Loop through each of the slot files.
	for slotFile in $search; do

        # Get the slot name.
        slotName=`cat $slotFile | jq -r .name`;
        echo "Found slot '$slotName' in '$slotFile'..."
    
        # Check to see if we have the slot type already.
        LATEST_VERSION=`aws lex-models get-slot-type-versions --name $slotName --region $region | jq -r '.slotTypes[0].version | select (.!=null)'`

        if [ $LATEST_VERSION ]; then
            echo "Found version '$LATEST_VERSION', updating..."
            CHECKSUM=`aws lex-models get-slot-type --name $slotName --region $region --slot-type-version "$LATEST_VERSION" | jq -r .checksum`
            aws lex-models put-slot-type --region $region --name $slotName \
                --cli-input-json "file://$slotFile" --checksum "$CHECKSUM"
        else
            echo "Creating..."
            aws lex-models put-slot-type --region $region --name $slotName \
                --cli-input-json "file://$slotFile"
        fi

        # Grab the latest version and publish, so the slot is available for intents.
        CHECKSUM=`aws lex-models get-slot-type --name $slotName --region $region --slot-type-version '$LATEST' | jq -r .checksum`
        echo "Publishing $slotName with checksum $CHECKSUM..."
        aws lex-models create-slot-type-version --name $slotName --region $region --checksum "$CHECKSUM"
	done
}

# Allows to call a function based on arguments passed to the script
$*
