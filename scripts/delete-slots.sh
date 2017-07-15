#!/usr/bin/env bash

# Abort on any error.
set -e

set -o xtrace
# Delete slots, based on the names in the files we have.
# Usage:
#   delete-slots us-east-1 ./folder/**/*.json
function delete-slots() {
    region=$1
    search=$2

    # Loop through each of the slot files.
	for slotFile in $search; do
        # Get the slot name.
        slotName=`cat $slotFile | jq -r .name`;

        # Write a bit o info and put the slot.
        echo "Deleting slot '$slotName' found in '$slotFile'..."
		aws lex-models delete-slot-type --region $region --name $slotName
	done
}

# Allows to call a function based on arguments passed to the script
$*
