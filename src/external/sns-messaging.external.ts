import { PaymentMessage } from 'src/types/payment-message.type';
import { IMessaging } from '../interfaces/messaging.interface';
import { SNS } from 'aws-sdk';

export class SNSMessaging implements IMessaging {
  private snsClient: SNS;

  constructor() {
    if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
      this.snsClient = new SNS({
        region: process.env.AWS_REGION,
        endpoint: 'http://localstack:4566',
      });
    } else {
      this.snsClient = new SNS({ region: process.env.AWS_REGION });
    }
  }

  async publishMessage(message: PaymentMessage): Promise<void> {
    const snsMessage: SNS.PublishInput = {
      TopicArn: process.env.PAYMENTS_SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
      MessageGroupId: message.type,
    };

    await this.snsClient.publish(snsMessage).promise();
  }
}
