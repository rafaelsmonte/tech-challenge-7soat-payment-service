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
  // method for testing SonarQube coverage, should not be merged on main
  static adjust_score_testing_coverage(score: number): string {
    if (score < 0) return '0';
    if (score > 100) return '100';
    return score.toFixed(2);
  }

  // method for testing SonarQube coverage, should not be merged on main
  static describe_number_testing_coverage(number: number): string {
    if (number % 2 === 0) return 'Even';
    return 'Odd';
  }

  // method for testing SonarQube coverage, should not be merged on main
  static calculate_discount_testing_coverage(price: number): string {
    if (price > 500) return '20%';
    if (price > 100) return '10%';
    return 'No discount';
  }

  // method for testing SonarQube coverage, should not be merged on main
  static determine_age_group_testing_coverage(age: number): string {
    if (age < 13) return 'Child';
    if (age < 18) return 'Teenager';
    if (age < 65) return 'Adult';
    return 'Senior';
  }

  // method for testing SonarQube coverage, should not be merged on main
  static speed_category_testing_coverage(speed: number): string {
    if (speed < 0) return 'Invalid';
    if (speed <= 30) return 'Slow';
    if (speed <= 70) return 'Normal';
    return 'Fast';
  }

}
