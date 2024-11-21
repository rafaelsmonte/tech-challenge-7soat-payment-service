import { Payment } from 'src/entities/payment.entity';

export interface IDatabase {
  findAllPayments(): Promise<Payment[]>;
  findPaymentById(id: number): Promise<Payment | null>;
  createPayment(payment: Payment): Promise<Payment>;
  updatePaymentStatus(payment: Payment): Promise<Payment>;
}
