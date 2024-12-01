import {
  PrismaClient,
  Payment as PrismaPayment,
  PaymentStatus as PrismaPaymentStatus,
  Prisma,
} from '@prisma/client';
import Decimal from 'decimal.js';
import { IDatabase } from '../interfaces/database.interface';
import { Payment } from '../entities/payment.entity';
import { DatabaseError } from '../errors/database.error';

export class PrismaDatabase implements IDatabase {
  private readonly prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async findAllPayments(): Promise<Payment[]> {
    try {
      const payments: PrismaPayment[] =
        await this.prismaClient.payment.findMany();

      return payments.map(
        (payment) =>
          new Payment(
            payment.id,
            Number(payment.externalId),
            payment.createdAt,
            payment.updatedAt,
            payment.orderId,
            payment.status,
            new Decimal(payment.price).toNumber(),
            payment.pixQrCode,
            payment.pixQrCodeBase64,
          ),
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to find payments');
    }
  }

  async findPaymentById(id: number): Promise<Payment | null> {
    try {
      const payment: PrismaPayment = await this.prismaClient.payment.findUnique(
        {
          where: { id },
        },
      );

      if (!payment) return null;

      return new Payment(
        payment.id,
        Number(payment.externalId),
        payment.createdAt,
        payment.updatedAt,
        payment.orderId,
        payment.status,
        new Decimal(payment.price).toNumber(),
        payment.pixQrCode,
        payment.pixQrCodeBase64,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to find payments');
    }
  }

  async createPayment(payment: Payment): Promise<Payment> {
    try {
      const createdPayment: PrismaPayment =
        await this.prismaClient.payment.create({
          data: {
            externalId: payment.getExternalId(),
            orderId: payment.getOrderId(),
            status: PrismaPaymentStatus.PENDING,
            price: new Prisma.Decimal(payment.getPrice()),
            pixQrCode: payment.getPixQrCode(),
            pixQrCodeBase64: payment.getPixQrCodeBase64(),
          },
        });

      return new Payment(
        createdPayment.id,
        Number(createdPayment.externalId),
        createdPayment.createdAt,
        createdPayment.updatedAt,
        createdPayment.orderId,
        createdPayment.status,
        new Decimal(createdPayment.price).toNumber(),
        createdPayment.pixQrCode,
        createdPayment.pixQrCodeBase64,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to save payment');
    }
  }

  async updatePaymentStatus(payment: Payment): Promise<Payment> {
    try {
      const updatedPayment: PrismaPayment =
        await this.prismaClient.payment.update({
          where: { id: payment.getId() },
          data: {
            status: PrismaPaymentStatus[payment.getStatus()],
          },
        });

      if (!updatedPayment) return null;

      return new Payment(
        updatedPayment.id,
        Number(updatedPayment.externalId),
        updatedPayment.createdAt,
        updatedPayment.updatedAt,
        updatedPayment.orderId,
        updatedPayment.status,
        new Decimal(updatedPayment.price).toNumber(),
        updatedPayment.pixQrCode,
        updatedPayment.pixQrCodeBase64,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to update payment status');
    }
  }
}
