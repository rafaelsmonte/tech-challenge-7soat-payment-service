import { IMessagingGateway } from '../interfaces/messaging.gateway.interface';
import { IMessaging } from '../interfaces/messaging.interface';
import { PaymentMessage } from '../types/payment-message.type';
import { MessageType } from '../enum/message-type.enum';
import { MessageSender } from '../enum/message-sender.enum';
import { MessageTarget } from '../enum/message-target.enum';

export class MessagingGateway implements IMessagingGateway {
  constructor(private messaging: IMessaging) {}

  public async publishPaymentStatusMessage(
    orderId: number,
    success: boolean,
  ): Promise<void> {
    let type: MessageType;

    if (success) {
      type = MessageType.MSG_PAYMENT_SUCCESS;
    } else {
      type = MessageType.MSG_PAYMENT_FAIL;
    }

    const message: PaymentMessage = {
      type,
      sender: MessageSender.PAYMENTS_SERVICE,
      target: MessageTarget.ORDERS_SERVICE,
      payload: {
        orderId,
      },
    };

    this.messaging.publishMessage(message);
  }
}
