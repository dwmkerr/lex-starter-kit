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
		--name ProjectName \
		--cli-input-json file://lex/slots/Oscar.ProjectName.json
	aws lex-models put-slot-type \
		--region us-east-1 \
		--name IssueTitle \
		--cli-input-json file://lex/slots/Oscar.IssueTitle.json
	aws lex-models put-slot-type \
		--region us-east-1 \
		--name IssueContent \
		--cli-input-json file://lex/slots/Oscar.IssueContent.json
	aws lex-models put-intent \
		--region us-east-1 \
		--name OpenIssue \
		--cli-input-json file://lex/intents/OpenIssue.json

