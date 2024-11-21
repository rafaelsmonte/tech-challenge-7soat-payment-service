#!/usr/bin/env bash
set -euo pipefail
 
# enable debug
# set -x
 
LOCALSTACK_HOST=localhost
AWS_REGION=us-east-1

echo "configuring sns"
echo "==================="

# https://docs.aws.amazon.com/cli/latest/reference/sns/create-topic.html
create_sns_topic() {
  local TOPIC_NAME_TO_CREATE=$1
  
  # CREATE SNS TOPIC
  # https://docs.aws.amazon.com/cli/latest/reference/sns/create-topic.html
  SNS_TOPIC_ARN=$(awslocal sns create-topic --endpoint-url http://${LOCALSTACK_HOST}:4566 --name "${TOPIC_NAME_TO_CREATE}" --region ${AWS_REGION} --attributes "FifoTopic=true,ContentBasedDeduplication=true" --query "TopicArn" --output text)
  echo "SNS Topic ARN: ${SNS_TOPIC_ARN}"
}

create_sns_topic "payments-topic.fifo"