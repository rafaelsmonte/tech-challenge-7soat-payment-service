import { PaymentMessage } from 'src/types/payment-message.type';

export interface IMessaging {
  publishMessage(message: PaymentMessage): Promise<void>;
}
