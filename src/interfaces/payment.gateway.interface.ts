import { Payment } from '../entities/payment.entity';

export interface IPaymentGateway {
  findAll(): Promise<Payment[]>;
  findById(id: number): Promise<Payment | null>;
  findByExternalId(id: number): Promise<Payment | null>;
  create(payment: Payment): Promise<Payment>;
  updateStatus(payment: Payment): Promise<Payment>;
}
