import { IExternalPayment } from '../interfaces/external-payment.interface';
import { IMessaging } from '../interfaces/messaging.interface';
import { MessagingGateway } from '../gateways/messaging-gateway';
import { PaymentUseCases } from '../usecases/payment.usecases';
import { PaymentGateway } from '../gateways/payment.gateway';
import { ExternalPaymentGateway } from '../gateways/external-payment-gateway';
import { IDatabase } from '../interfaces/database.interface';
import { PaymentAdapter } from '../adapters/payment.adapter';

export class PaymentController {
  static async findAll(database: IDatabase): Promise<string> {
    const paymentGateway = new PaymentGateway(database);

    const payments = await PaymentUseCases.findAll(paymentGateway);

    return PaymentAdapter.adaptArrayJson(payments);
  }

  static async findById(database: IDatabase, id: number): Promise<string> {
    const paymentGateway = new PaymentGateway(database);

    const payment = await PaymentUseCases.findById(paymentGateway, id);

    return PaymentAdapter.adaptJson(payment);
  }

  static async create(
    database: IDatabase,
    externalPayment: IExternalPayment,
    orderId: string,
    price: number,
  ): Promise<string> {
    const paymentGateway = new PaymentGateway(database);
    const externalPaymentGateway = new ExternalPaymentGateway(externalPayment);

    const payment = await PaymentUseCases.create(
      paymentGateway,
      externalPaymentGateway,
      orderId,
      price,
    );

    return PaymentAdapter.adaptJson(payment);
  }

  static async updateStatusOnPaymentReceived(
    database: IDatabase,
    externalPayment: IExternalPayment,
    messaging: IMessaging,
    paymentId: number,
  ): Promise<void> {
    const paymentGateway = new PaymentGateway(database);
    const externalPaymentGateway = new ExternalPaymentGateway(externalPayment);
    const messagingGateway = new MessagingGateway(messaging);

    await PaymentUseCases.updateStatusOnPaymentReceived(
      paymentGateway,
      externalPaymentGateway,
      messagingGateway,
      paymentId,
    );
  }
  //method for testing sonnarqube coverage, should not be merged on main
  static async updateStatusOnPaymentReceived_testing_coverage(
    database: IDatabase,
    externalPayment: IExternalPayment,
    messaging: IMessaging,
    paymentId: number,
  ): Promise<void> {
    const paymentGateway = new PaymentGateway(database);
    const externalPaymentGateway = new ExternalPaymentGateway(externalPayment);
    const messagingGateway = new MessagingGateway(messaging);

    await PaymentUseCases.updateStatusOnPaymentReceived(
      paymentGateway,
      externalPaymentGateway,
      messagingGateway,
      paymentId,
    );
  }
}
