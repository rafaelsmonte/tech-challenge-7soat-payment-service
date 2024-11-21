import { IExternalPayment } from '../interfaces/external-payment.interface';
import { IExternalPaymentGateway } from '../interfaces/external-payment.gateway.interface';
import { ExternalPayment } from 'src/entities/external-payment.entity';

export class ExternalPaymentGateway implements IExternalPaymentGateway {
  constructor(private externalPaymentMethod: IExternalPayment) {}

  public async create(
    externalPayment: ExternalPayment,
  ): Promise<ExternalPayment> {
    return this.externalPaymentMethod.create(externalPayment.getPrice());
  }

  public async isPaymentApproved(externalPaymentId: number): Promise<boolean> {
    return this.externalPaymentMethod.isPaymentApproved(externalPaymentId);
  }
}
