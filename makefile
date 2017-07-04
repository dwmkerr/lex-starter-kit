build:
	cd functions/boilerplate-function && yarn install && zip -r ../../boilerplateFunction.zip .

upload:
	aws s3 cp boilerplateFunction.zip s3://lex-functions/functions/boilerplateFunction.zip

create:
	aws lambda create-function \
		--region eu-west-1 \
		--function-name boilerplateFunction \
		--runtime nodejs6.10 \
		--handler index.handler \
		--role arn:aws:iam::160696617623:role/boilerplate-policy \
		--code S3Bucket=lex-functions,S3Key=functions/boilerplateFunction.zip

update:
	aws lambda update-function-code \
    --region eu-west-1 \
    --function-name boilerplateFunction \
    --s3-bucket lex-functions \
    --s3-key functions/boilerplateFunction.zip

release: deploy
	VERSION=$$(aws lambda publish-version --region eu-west-1 --function-name boilerplateFunction | jq -r .Version); \
	aws lambda update-alias --function-name boilerplateFunction --region eu-west-1 --function-version $$VERSION --name PROD

deploy: build upload update

setup: build upload create
