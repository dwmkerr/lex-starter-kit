REGION := us-east-1
FUNCTION := serverless-summit

# Helper variables we use to check if things exist.
# Consider moving into a script of its own, and checking we are logged in.
JQ_EXISTS := $(shell command -v jq 2> /dev/null)
AWS_CLI_EXISTS := $(shell command -v aws 2> /dev/null)

# Lints the lambda function.
lint:
	cd lambda && npm install && npm run lint

# Tests the lambda function.
test:
	cd lambda && npm install && npm test

# Builds the lambda function. Copies it to a clean location first so that we
# can eliminate any non-production node modules.
build:
	$(info Building lambda function code...)
	rm -rf ./artifacts/lambda
	cp -R ./lambda ./artifacts/lambda
	rm -rf ./artifacts/lambda/node_modules
	cd ./artifacts/lambda && npm install --production && zip -r ../$(FUNCTION).zip .

# Creates a coverage report.
coverage:
	cd lambda && npm install && npm run coverage

# Sets up the core AWS resources.
setup: check-dependencies build
	# Create the bucket. If it fails, it's probably because the name is in use.
	# aws s3 mb s3://$(BUCKET) --region $(REGION)
	# aws s3 cp ./artifacts/$(FUNCTION).zip s3://$(BUCKET)/$(FUNCTION).zip

	# Create the role and set the policy.
	aws iam create-role --role-name "$(FUNCTION)-role" --assume-role-policy-document file://aws/lambda-policy-doc.json
	aws iam put-role-policy --role-name "$(FUNCTION)-role" --policy-name "$(FUNCTION)-policy" --policy-document file://aws/policy.json
	sleep 10 # roles take a while to setup

	# Create the bucket and lambda function.
	ACCOUNT_ID=`aws sts get-caller-identity --output text --query 'Account'`; \
	aws lambda create-function \
		--region $(REGION) \
		--function-name $(FUNCTION) \
		--runtime nodejs6.10 \
		--handler index.handler \
		--environment="Variables={DEBUG=lex-starter-kit}" \
		--role "arn:aws:iam::$$ACCOUNT_ID:role/$(FUNCTION)-role" \
        --zip-file fileb://artifacts/$(FUNCTION).zip

# Set environment variables for the lambda function.
config:
ifndef TWILIO_SID
	$(error "Environment variable $$TWILIO_SID must be set.")
endif
ifndef TWILIO_AUTH_TOKEN
	$(error "Environment variable $$TWILIO_AUTH_TOKEN must be set.")
endif
ifndef TWILIO_PHONE_NUMBER
	$(error "Environment variable $$TWILIO_PHONE_NUMBER must be set.")
endif
ifndef GITHUB_USERNAME
	$(error "Environment variable $$GITHUB_USERNAME must be set.")
endif
ifndef GITHUB_PASSWORD
	$(error "Environment variable $$GITHUB_PASSWORD must be set.")
endif
ifndef GITHUB_CLIENT_ID
	$(error "Environment variable $$GITHUB_CLIENT_ID must be set.")
endif
ifndef GITHUB_CLIENT_SECRET
	$(error "Environment variable $$GITHUB_CLIENT_SECRET must be set.")
endif
	aws lambda update-function-configuration \
		--region $(REGION) \
		--function-name $(FUNCTION) \
		--environment="Variables={TWILIO_SID=$(TWILIO_SID),TWILIO_AUTH_TOKEN=$(TWILIO_AUTH_TOKEN),TWILIO_PHONE_NUMBER=$(TWILIO_PHONE_NUMBER),GITHUB_USERNAME=$(GITHUB_USERNAME),GITHUB_PASSWORD=$(GITHUB_PASSWORD),GITHUB_CLIENT_ID=$(GITHUB_CLIENT_ID),GITHUB_CLIENT_SECRET=$(GITHUB_CLIENT_SECRET)}"

# Deploys updates.
deploy-lambda: build
	aws lambda update-function-code \
		--region $(REGION) \
		--function-name $(FUNCTION) \
        --zip-file fileb://artifacts/$(FUNCTION).zip

deploy-lex:
	# Update the slots.
	./scripts/deploy-slots.sh deploy-slots $(REGION) "lex/slots/*.json"

	# Update the intents.
	ACCOUNT_ID=`aws sts get-caller-identity --output text --query 'Account'`; \
	./scripts/deploy-intents.sh deploy-intents "$(REGION)" "$(FUNCTION)" $$ACCOUNT_ID `find ./lex/intents -name '*.json'`

	# Update the bot.
	./scripts/deploy-bot.sh deploy-bot "$(REGION)" "lex/bot/Bot.json"

deploy: deploy-lambda deploy-lex

# Destroys some resources. Still work in progress for others.
destroy:
	aws lambda delete-function --function-name $(FUNCTION) || true
	aws iam delete-role-policy --role-name "$(FUNCTION)-role" --policy-name "$(FUNCTION)-policy" || true
	aws iam delete-role --role-name "$(FUNCTION)-role" || true

cli:
	cd oscar-cli; npm build; npm link;

# Utility to show all utterances.
utterances:
	for file in "./lex/intents/*.json"; do cat $$file | jq .sampleUtterances[0]; done

check-dependencies:
ifndef JQ_EXISTS
	$(error "Error: jq must be installed.")
endif
ifndef AWS_CLI_EXISTS
	$(error "Error: aws-cli must be installed.")
endif
