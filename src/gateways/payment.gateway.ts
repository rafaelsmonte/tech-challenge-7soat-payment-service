import { IPaymentGateway } from '../interfaces/payment.gateway.interface';
import { IDatabase } from '../interfaces/database.interface';
import { Payment } from '../entities/payment.entity';

export class PaymentGateway implements IPaymentGateway {
  constructor(private database: IDatabase) {}

  async findAll(): Promise<Payment[]> {
    return this.database.findAllPayments();
  }

  async findById(id: number): Promise<Payment | null> {
    return this.database.findPaymentById(id);
  }

  async create(payment: Payment): Promise<Payment> {
    return this.database.createPayment(payment);
  }

  async updateStatus(payment: Payment): Promise<Payment> {
    return this.database.updatePaymentStatus(payment);
  }
}
