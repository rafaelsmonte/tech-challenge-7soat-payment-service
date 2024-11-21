import { ExternalPayment } from '../entities/external-payment.entity';

export interface IExternalPayment {
  create(price: number): Promise<ExternalPayment>;
  isPaymentApproved(externalPaymentId: number): Promise<boolean>;
}
