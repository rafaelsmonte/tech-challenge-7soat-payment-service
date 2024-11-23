import { PaymentMessage } from '../types/payment-message.type';

export interface IMessaging {
  publishMessage(message: PaymentMessage): Promise<void>;
}
