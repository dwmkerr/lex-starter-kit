BUCKET := oscarbot-dave
REGION := us-east-1
FUNCTION := oscarbot

build:
	cd oscarbot && yarn install && zip -r ../$(FUNCTION).zip .

lint:
	cd oscarbot && yarn && npm run lint

test:
	cd oscarbot && yarn && npm test

aws: build
	# Create the bucket. If it fails, it's probably because the name is in use.
	aws s3 mb s3://$(BUCKET) --region $(REGION)
	aws s3 cp oscarbot.zip s3://$(BUCKET)/$(FUNCTION).zip
	
	# Create the role and set the policy.
	aws iam create-role --role-name "$(FUNCTION)-role" --assume-role-policy-document file://aws/lambda-policy-doc.json
	aws iam put-role-policy --role-name "$(FUNCTION)-role" --policy-name "$(FUNCTION)-policy" --policy-document file://aws/policy.json
	
	# Create the bucket and lambda function.
	ACCOUNT_ID=`aws sts get-caller-identity --output text --query 'Account'`; \
	aws lambda create-function \
		--region $(REGION) \
		--function-name $(FUNCTION) \
		--runtime nodejs6.10 \
		--handler index.handler \
		--role "arn:aws:iam::$$ACCOUNT_ID:role/$(FUNCTION)-role" \
		--code S3Bucket=$(BUCKET),S3Key=$(FUNCTION).zip

destroy:
	aws lambda delete-function --function-name $(FUNCTION) || true
	aws iam delete-role-policy --role-name "$(FUNCTION)-role" --policy-name "$(FUNCTION)-policy" || true
	aws iam delete-role --role-name "$(FUNCTION)-role" || true
	aws s3 rb s3://$(BUCKET) --force || true

upload:
	aws s3 cp oscarbot.zip s3://$(BUCKET)/$(FUNCTION).zip
	aws lambda update-function-code \
		--region us-east-1 \
		--function-name intentOscarBot \
		--s3-bucket $(BUCKET) \
		--s3-key $(FUNCTION).zip

# Work in progress. Creates the slots, intents and bot.
bot:
	# Create the slots.
	for slot in lex/slots/*.json; do \
		NAME=`cat $$slot | jq -r .name`; \
		echo "$$slot Creating slot -> $$NAME..."; \
		aws lex-models put-slot-type --region $(REGION) --name $$NAME --cli-input-json "file://$$slot"; \
	done
	
	# Create the intents.
	for intent in lex/intents/**/*.json; do \
		NAME=`cat $$intent | jq -r .name`; \
		echo "$$intent creating intent -> $$NAME..."; \
		aws lambda add-permission --region $(REGION) \
			--function-name $(FUNCTION) \
			--statement-id $(FUNCTION)-$$NAME \
			--action lambda:InvokeFunction \
			--principal lex.amazonaws.com \
			--source-arn "arn:aws:lex:$(REGION):$$ACOUNT_NO:intent:$$INTENT:*"; \
		aws lex-models put-intent \
			--region $(REGION) \
			--name $$NAME \
			--cli-input-json "file://$$intent"; \
	done

etc:
	# Allow the intents access to the lambda function.
	aws lambda add-permission --region us-east-1 \
		--function-name intentOscarBot \
		--statement-id LexOscar-DescribeLastCommit \
		--action lambda:InvokeFunction \
		--principal lex.amazonaws.com \
		--source-arn "arn:aws:lex:us-east-1:160696617623:intent:DescribeLastCommit:*"
	aws lambda add-permission --region us-east-1 \
		--function-name intentOscarBot \
		--statement-id LexOscar-ThreeLaws \
		--action lambda:InvokeFunction \
		--principal lex.amazonaws.com \
		--source-arn "arn:aws:lex:us-east-1:160696617623:intent:ThreeLaws:*"
	aws lambda add-permission --region us-east-1 \
		--function-name intentOscarBot \
		--statement-id LexOscar-TopIssues \
		--action lambda:InvokeFunction \
		--principal lex.amazonaws.com \
		--source-arn "arn:aws:lex:us-east-1:160696617623:intent:TopIssues:*"
	# Add Intents to Lex
	aws lex-models put-intent \
		--region us-east-1 \
		--name DescribeLastCommit \
		--cli-input-json file://lex/intents/DescribeLastCommit.json
	aws lex-models put-intent \
		--region us-east-1 \
		--name OpenIssue \
		--cli-input-json file://lex/intents/OpenIssue.json
	aws lex-models put-intent \
		--region us-east-1 \
		--name CountIssues \
		--cli-input-json file://lex/intents/CountIssues.json
	aws lex-models put-intent \
		--region us-east-1 \
		--name ThreeLaws \
		--cli-input-json file://lex/intents/conversational/ThreeLaws.json
	aws lex-models put-intent \
		--region us-east-1 \
		--name TopIssues \
		--cli-input-json file://lex/intents/TopIssues.json

bot-down:
	aws lex-models delete-slot-type --region us-east-1 --name Repository
	aws lex-models delete-slot-type --region us-east-1 --name IssueTitle
	aws lex-models delete-slot-type --region us-east-1 --name IssueContent
