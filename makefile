REGION := us-east-1
FUNCTION := lex-starter

# Variables for the actual function
COUNTRY := sg
REGION := sg

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

# Sets up the core AWS resources.
setup: check-dependencies build
	@./scripts/setup.sh "$(REGION)" "$(FUNCTION)" "nodejs10.x"

# Set environment variables for the lambda function.
config:
	aws lambda update-function-configuration \
		--region $(REGION) \
		--function-name $(FUNCTION) \
		--environment="Variables={COUNTRY=$(COUNTRY),REGION=$(REGION)}"

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

# Check the required tools are available.
check-dependencies:
	@./scripts/check-dependencies.sh
