import { ExternalPayment } from '../entities/external-payment.entity';

export interface IExternalPaymentGateway {
  create(externalPayment: ExternalPayment): Promise<ExternalPayment>;
  isPaymentApproved(externalPaymentId: number): Promise<boolean>;
}
