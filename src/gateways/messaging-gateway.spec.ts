import { MessagingGateway } from './messaging-gateway';
import { IMessaging } from '../interfaces/messaging.interface';
import { PaymentMessage } from 'src/types/payment-message.type';
import { MessageType } from 'src/enum/message-type.enum';
import { MessageSender } from 'src/enum/message-sender.enum';
import { MessageTarget } from 'src/enum/message-target.enum';

jest.mock('../interfaces/messaging.interface');

describe('MessagingGateway', () => {
  let messagingGateway: MessagingGateway;
  let messagingMock: jest.Mocked<IMessaging>;

  beforeEach(() => {
    messagingMock = {
      publishMessage: jest.fn(),
    };
    messagingGateway = new MessagingGateway(messagingMock);
  });

  it('should call publishMessage with success message when success is true', async () => {
    const orderId = 123;
    const success = true;

    const expectedMessage: PaymentMessage = {
      type: MessageType.MSG_PAYMENT_SUCCESS,
      sender: MessageSender.PAYMENTS_SERVICE,
      target: MessageTarget.ORDERS_SERVICE,
      payload: {
        orderId,
      },
    };

    await messagingGateway.publishPaymentStatusMessage(orderId, success);

    expect(messagingMock.publishMessage).toHaveBeenCalledWith(expectedMessage);
    expect(messagingMock.publishMessage).toHaveBeenCalledTimes(1);
  });

  it('should call publishMessage with fail message when success is false', async () => {
    const orderId = 123;
    const success = false;

    const expectedMessage: PaymentMessage = {
      type: MessageType.MSG_PAYMENT_FAIL,
      sender: MessageSender.PAYMENTS_SERVICE,
      target: MessageTarget.ORDERS_SERVICE,
      payload: {
        orderId,
      },
    };

    await messagingGateway.publishPaymentStatusMessage(orderId, success);

    expect(messagingMock.publishMessage).toHaveBeenCalledWith(expectedMessage);
    expect(messagingMock.publishMessage).toHaveBeenCalledTimes(1);
  });
});
