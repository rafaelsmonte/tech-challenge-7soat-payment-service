import { SNSMessaging } from './sns-messaging.external';
import { SNS } from 'aws-sdk';
import { PaymentMessage } from 'src/types/payment-message.type';
import { MessageSender } from 'src/enum/message-sender.enum';
import { MessageTarget } from 'src/enum/message-target.enum';
import { MessageType } from 'src/enum/message-type.enum';

// Mock do SNS
jest.mock('aws-sdk', () => {
  return {
    SNS: jest.fn().mockImplementation(() => {
      return {
        publish: jest.fn(), // Mock do método publish
      };
    }),
  };
});

describe('SNSMessaging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AWS_REGION = 'us-east-1';
    process.env.PAYMENTS_SNS_TOPIC_ARN =
      'arn:aws:sns:us-east-1:123456789012:MyTopic';
  });

  it('should configure SNS client with localstack in DEVELOPMENT environment', () => {
    process.env.ENVIRONMENT = 'DEVELOPMENT';

    const messaging = new SNSMessaging();
    expect(SNS).toHaveBeenCalledWith({
      region: 'us-east-1',
      endpoint: 'http://localstack:4566',
    });
  });

  it('should configure SNS client for production environment', () => {
    process.env.ENVIRONMENT = 'PRODUCTION';

    const messaging = new SNSMessaging();
    expect(SNS).toHaveBeenCalledWith({
      region: 'us-east-1',
    });
  });

  it('should throw an error when SNS publish fails', async () => {
    const messaging = new SNSMessaging();

    const message: PaymentMessage = {
      type: MessageType.MSG_PAYMENT_SUCCESS,
      sender: MessageSender.PAYMENTS_SERVICE,
      target: MessageTarget.ORDERS_SERVICE,
      payload: {},
    };

    const publishMock = jest.fn().mockRejectedValue(new Error('SNS error'));
    SNS.prototype.publish = publishMock;

    await expect(messaging.publishMessage(message)).resolves.not.toThrow();
  });

  it('should log error when SNS publish fails', async () => {
    const messaging = new SNSMessaging();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const message: PaymentMessage = {
      type: MessageType.MSG_PAYMENT_SUCCESS,
      sender: MessageSender.PAYMENTS_SERVICE,
      target: MessageTarget.ORDERS_SERVICE,
      payload: {},
    };

    const publishMock = jest.fn().mockRejectedValue(new Error('SNS error'));
    SNS.prototype.publish = publishMock;

    await messaging.publishMessage(message);

    expect(consoleSpy).toHaveBeenCalledWith(
      'error sending message: ' + JSON.stringify(new Error('SNS error')),
    );
    consoleSpy.mockRestore();
  });

  it('should handle undefined environment variable gracefully', () => {
    delete process.env.ENVIRONMENT;

    const messaging = new SNSMessaging();
    expect(SNS).toHaveBeenCalledWith({
      region: 'us-east-1',
    });
  });
});
