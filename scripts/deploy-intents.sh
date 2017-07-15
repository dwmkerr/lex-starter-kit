#!/usr/bin/env bash

# Abort on any error.
set -e

# Create intents from a folder.
# Usage:
#   deploy-intents us-east-1 ./folder/**/*.json
function deploy-intents() {
    region=$1
    functionName=$2
    accountNo=$3
    shift 3
    search=$*

    # Loop through each of the intent files.
	for intentFile in $search; do

        # Get the intent name.
        intentName=`cat $intentFile | jq -r .name`
        echo "Found intent '$intentName' in '$intentFile'..."

        # Build a statement name. This is goes in the lambda function policy
        # doc to allow the intent to call the function.
        STATEMENT_ID="$functionName-$intentName"
        STATEMENT=`aws lambda get-policy --function-name $functionName --region $region | jq -r .Policy | jq -r ".Statement[].Sid | select(.==\"$STATEMENT_ID\")"`
        if [ $STATEMENT ]; then
            echo "Lambda function $functionName already has $STATEMENT_ID permission set..."
        else
            echo "Setting $STATEMENT_ID permission on lambda function $functionName"
            aws lambda add-permission --region $region \
                --function-name $functionName \
                --statement-id "$STATEMENT_ID" \
                --action lambda:InvokeFunction \
                --principal lex.amazonaws.com \
                --source-arn "arn:aws:lex:$region:$accountNo:intent:$intentName:*"
        fi

        # Ensure that no matter what lamba function ARN is in the intent file,
        # we use the correct function.
        # I'm so, so sorry I have to do this.
        lambdaFunc="arn:aws:lambda:$region:$accountNo:function:$functionName"
        cat $intentFile | jq --arg l "$lambdaFunc" '(select(.fulfillmentActivity != null) .fulfillmentActivity.codeHook.uri |= $l) | (select(.dialogCodeHook != null) .dialogCodeHook.uri |= $l)' > $intentFile.temp

        # Now more shenanigans. Go through each slottype and replace '$VERSION'
        # with the latest published version. Urgh.
        SLOTTYPES=`cat $intentFile | jq -r ".slots[].slotType"`
        for SLOTTYPE in $SLOTTYPES; do

            # Get the versions, rip out the version number of the most recent one.
            SLOTTYPEVERSION=`aws lex-models get-slot-type-versions --name $SLOTTYPE --region $region | jq -r ".slotTypes[-1].version"`
            echo "Updating $intentName slot $SLOTTYPE to latest version ($SLOTTYPEVERSION)..."

            # Replace the version number in the slot type.
            cp $intentFile.temp $intentFile.temp2
            cat $intentFile.temp2 | jq --arg v "$SLOTTYPEVERSION" --arg s "$SLOTTYPE" '(.slots[] | select(.slotType == $s) | .slotTypeVersion) |= $v' > $intentFile.temp
            rm $intentFile.temp2

        done


        # Check to see if we have the intent already.
        LATEST_VERSION=`aws lex-models get-intent-versions --name $intentName --region $region | jq -r '.intents[0].version | select (.!=null)'`

        # Now update or create the intent, as required.
        if [ $LATEST_VERSION ]; then
            echo "Found version '$LATEST_VERSION', updating..."
            CHECKSUM=`aws lex-models get-intent --name $intentName --region $region --intent-version "$LATEST_VERSION" | jq -r .checksum`
            aws lex-models put-intent --region $region --name $intentName \
                --cli-input-json "file://$intentFile.temp" --checksum "$CHECKSUM"
        else
            # Write a bit o info and put the slot.
            echo "Creating intent '$intentName' from '$intentFile.temp'..."
            aws lex-models put-intent --region $region --name $intentName \
                --cli-input-json "file://$intentFile.temp"
        fi

        # Grab the latest version and publish.
        CHECKSUM=`aws lex-models get-intent --name $intentName --region $region --intent-version '$LATEST' | jq -r .checksum`
        echo "Publishing $intentName with checksum $CHECKSUM..."
        aws lex-models create-intent-version --name $intentName --region $region --checksum "$CHECKSUM"
	done
}

# Allows to call a function based on arguments passed to the script
$*
