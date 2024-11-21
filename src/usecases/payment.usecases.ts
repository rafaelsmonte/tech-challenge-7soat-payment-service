import { Payment } from '../entities/payment.entity';
import { InvalidPaymentStatusError } from '../errors/invalid-payment-status.error';
import { IExternalPaymentGateway } from '../interfaces/external-payment.gateway.interface';
import { PaymentNotFoundError } from '../errors/payment-not-found.error';
import { IMessagingGateway } from '../interfaces/messaging.gateway.interface';
import { IPaymentGateway } from '../interfaces/payment.gateway.interface';
import { PaymentStatus } from '../enum/payment-status.enum';
import { ExternalPayment } from 'src/entities/external-payment.entity';

export class PaymentUseCases {
  static async findAll(paymentGateway: IPaymentGateway): Promise<Payment[]> {
    const payments = await paymentGateway.findAll();
    return payments;
  }

  static async findById(
    paymentGateway: IPaymentGateway,
    id: number,
  ): Promise<Payment> {
    const payment = await paymentGateway.findById(id);

    if (!payment) throw new PaymentNotFoundError('Payment not found');

    return payment;
  }

  static async create(
    paymentGateway: IPaymentGateway,
    externalPaymentGateway: IExternalPaymentGateway,
    orderId: number,
    price: number,
  ): Promise<Payment> {
    const newExternalPayment = await externalPaymentGateway.create(
      ExternalPayment.new(price),
    );

    const newPayment = await paymentGateway.create(
      Payment.new(
        newExternalPayment.getId(),
        price,
        orderId,
        PaymentStatus.PENDING,
        newExternalPayment.getPixQrCode(),
        newExternalPayment.getPixQrCodeBase64(),
      ),
    );

    return newPayment;
  }

  static async updateStatusOnPaymentReceived(
    paymentGateway: IPaymentGateway,
    externalPaymentGateway: IExternalPaymentGateway,
    messagingGateway: IMessagingGateway,
    paymentId: number,
  ): Promise<void> {
    const payment = await paymentGateway.findById(paymentId);

    if (!payment) throw new PaymentNotFoundError('Payment not found');

    if (payment.getStatus() != PaymentStatus.PENDING)
      throw new InvalidPaymentStatusError('Payment status is not pending');

    let success = false;

    if (await externalPaymentGateway.isPaymentApproved(paymentId)) {
      success = true;
      payment.setStatus(PaymentStatus.SUCCESS);
    } else {
      success = false;
      payment.setStatus(PaymentStatus.FAIL);
    }

    messagingGateway.publishPaymentStatusMessage(payment.getOrderId(), success);

    await paymentGateway.updateStatus(payment);
  }
}
