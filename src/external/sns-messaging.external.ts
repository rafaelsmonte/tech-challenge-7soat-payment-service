import { PaymentMessage } from '../types/payment-message.type';
import { IMessaging } from '../interfaces/messaging.interface';
import { SNS } from 'aws-sdk';

export class SNSMessaging implements IMessaging {
  private snsClient: SNS;

  constructor() {
    if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
      this.snsClient = new SNS({
        region: process.env.AWS_DEFAULT_REGION,
        endpoint: 'http://localstack:4566',
      });
    } else {
      this.snsClient = new SNS({ region: process.env.AWS_DEFAULT_REGION });
    }
  }

  async publishMessage(message: PaymentMessage): Promise<void> {
    const snsMessage: SNS.PublishInput = {
      TopicArn: process.env.PAYMENTS_SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
      MessageGroupId: message.type,
    };

    try {
      await this.snsClient.publish(snsMessage).promise();
    } catch (error) {
      console.log('error sending message: ' + JSON.stringify(error));
      // TODO throw messaging exception
    }
  }
}
