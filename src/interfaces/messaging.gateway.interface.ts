import { PaymentStatus } from 'src/enum/payment-status.enum';

export interface IMessagingGateway {
  publishPaymentStatusMessage(orderId: number, success: boolean): Promise<void>;
}
