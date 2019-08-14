REGION := us-east-1
FUNCTION := lex-starter

# Variables for the actual function
COUNTRY := sg

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

# Deploys updates.
deploy-lambda: build
	aws lambda update-function-code \
		--region $(REGION) \
		--function-name $(FUNCTION) \
        --zip-file fileb://artifacts/$(FUNCTION).zip
	
	# These are currently dummy env vars just to show how it works...
	aws lambda update-function-configuration \
		--region $(REGION) \
		--function-name $(FUNCTION) \
		--environment="Variables={COUNTRY=$(COUNTRY),REGION=sg}"

deploy-lex:
	# Update the slots, intents and bot.
	@./scripts/deploy-slots.sh deploy-slots $(REGION) "lex/slots/*.json"
	@./scripts/deploy-intents.sh deploy-intents "$(REGION)" "$(FUNCTION)" `find ./lex/intents -name '*.json'`
	@./scripts/deploy-bot.sh deploy-bot "$(REGION)" "lex/bot/Bot.json"

deploy: deploy-lambda deploy-lex

# Destroy resources created by 'setup'.
# This still needs work, the difference between the bot and other resources is
# seemingly arbitrary.
destroy:
	@./scripts/destroy.sh "$(FUNCTION)"
	@./scripts/destroy-bot.sh destroy-bot "$(REGION)" "lex/bot/Bot.json"

# Rename a bot. Should be done BEFORE create.
rename-bot:
	@./scripts/rename-bot.sh rename-bot "./lex/bot/Bot.json"

# Utility to show all utterances.
utterances:
	for file in "./lex/intents/*.json"; do cat $$file | jq .sampleUtterances[0]; done

# Check the required tools are available.
check-dependencies:
	@./scripts/check-dependencies.sh
