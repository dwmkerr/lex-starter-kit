BUCKET := oscarbot

build:
	cd functions/oscarbot && yarn install && zip -r ../../oscarbot.zip .

lint:
	cd functions/oscarbot && yarn && npm run lint

test:
	cd functions/oscarbot && yarn && npm test

upload:
	aws s3 cp oscarbot.zip s3://$(BUCKET)/functions/oscarbot.zip

create:
	aws lambda create-function \
		--region us-east-1 \
		--function-name intentOscarBot \
		--runtime nodejs6.10 \
		--handler index.handler \
		--role `terraform output role`\
		--code S3Bucket=$(BUCKET),S3Key=functions/oscarbot.zip

update:
	aws lambda update-function-code \
    --region us-east-1 \
    --function-name intentOscarBot \
    --s3-bucket $(BUCKET) \
    --s3-key functions/oscarbot.zip

release: deploy
	VERSION=$$(aws lambda publish-version --region us-east-1 --function-name intentOscarBot | jq -r .Version); \
	aws lambda update-alias --function-name intentOscarBot --region us-east-1 --function-version $$VERSION --name PROD

deploy: build upload update

setup: build upload create

# Creates the infrastructure required.
infra-up:
	terraform apply -var 'bucket-name=$(BUCKET)'

# Destoys the infrastructure.
infra-down:
	terraform destroy

# Work in progress. Creates the slots, intents and bot.
bot:
	aws lex-models put-slot-type \
		--region us-east-1 \
		--name Repository \
		--cli-input-json file://lex/slots/Repository.json
	aws lex-models put-slot-type \
		--region us-east-1 \
		--name IssueTitle \
		--cli-input-json file://lex/slots/IssueTitle.json
	aws lex-models put-slot-type \
		--region us-east-1 \
		--name IssueContent \
		--cli-input-json file://lex/slots/IssueContent.json
	aws lex-models put-intent \
		--region us-east-1 \
		--name OpenIssue \
		--cli-input-json file://lex/intents/GetStars.json
	# Allow the intents access to the lambda function.
	aws lambda add-permission --region us-east-1 \
		--function-name intentOscarBot \
		--statement-id LexOscar-CountIssues \
		--action lambda:InvokeFunction \
		--principal lex.amazonaws.com \
		--source-arn "arn:aws:lex:us-east-1:160696617623:intent:CountIssues:*"
	aws lambda add-permission --region us-east-1 \
		--function-name intentOscarBot \
		--statement-id LexOscar-DescribeLastCommit \
		--action lambda:InvokeFunction \
		--principal lex.amazonaws.com \
		--source-arn "arn:aws:lex:us-east-1:160696617623:intent:DescribeLastCommit:*"
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
	aws lambda add-permission --region us-east-1 \
		--function-name intentOscarBot \
		--statement-id LexOscar-ThreeLaws \
		--action lambda:InvokeFunction \
		--principal lex.amazonaws.com \
		--source-arn "arn:aws:lex:us-east-1:160696617623:intent:ThreeLaws:*"
	aws lex-models put-intent \
		--region us-east-1 \
		--name ThreeLaws \
		--cli-input-json file://lex/intents/conversational/ThreeLaws.json

bot-down:
	aws lex-models delete-slot-type --region us-east-1 --name Repository
	aws lex-models delete-slot-type --region us-east-1 --name IssueTitle
	aws lex-models delete-slot-type --region us-east-1 --name IssueContent
