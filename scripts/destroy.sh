#!/usr/bin/env bash

# destroy.sh
#
# This script will destroy everything created.
# This means:
#   Roles
#   Policies
#   The Bot
#   The Lambda Function
#
# Parameters are:
#   - lambda function name
#
# Example:
#
#   ./destroy.sh lex-sample
if [ $# -lt 1 ]; then
    echo "Usage: destroy.sh function-name"
    exit 1
fi
function_name="$1"

# Write a message if DEBUG=1
debug () {
    if [ "$DEBUG" = "1" ]; then
        echo -e "debug: $1"
    fi
}

debug "setting up:"
debug "  function_name: ${function_name}"

# Delete the policy and the role.
role_name="${function_name}-role"
policy_name="${function_name}-policy"
echo "Deleting policy '${policy_name}'..."
aws iam delete-role-policy --role-name "${role_name}" --policy-name "${policy_name}" || true

echo "Deleting role '${role_name}'..."
aws iam delete-role --role-name "${role_name}" || true

echo "Deleting function '${function_name}'..."
aws lambda delete-function --function-name "${function_name}" || true

