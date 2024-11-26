import { PrismaDatabase } from './prisma-database.external';
import { Payment } from '../entities/payment.entity';
import { PaymentStatus } from '../enum/payment-status.enum';
import Decimal from 'decimal.js';
import { Prisma } from '@prisma/client';

jest.mock('@prisma/client', () => {
  class MockDecimal {
    private value: number;

    constructor(value: number) {
      this.value = value;
    }

    toNumber() {
      return this.value;
    }

    plus(amount: number) {
      return new MockDecimal(this.value + amount);
    }
  }
  return {
    Decimal: MockDecimal,
    PrismaClient: jest.fn(() => prismaMock),
    PaymentStatus: {
      PENDING: 'PENDING',
      SUCCESS: 'SUCCESS',
      FAILED: 'FAILED',
    },
  };
});

const prismaMock = {
  payment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('PrismaDatabase', () => {
  let database: PrismaDatabase;

  beforeEach(() => {
    database = new PrismaDatabase();
  });

  const mockPayment = new Payment(
    1,
    101,
    new Date('2024-01-01T00:00:00Z'),
    new Date('2024-01-02T00:00:00Z'),
    '123',
    PaymentStatus.PENDING,
    200.75,
    'someQrCode',
    'someBase64',
  );

  describe('findAllPayments', () => {
    it('should return a list of payments', async () => {
      const mockPayments = [
        {
          id: 1,
          externalId: '101',
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-02T00:00:00Z'),
          orderId: 123,
          status: PaymentStatus.PENDING,
          price: new Decimal(200.75).toNumber(),
          pixQrCode: 'someQrCode',
          pixQrCodeBase64: 'someBase64',
        },
      ];

      (prismaMock.payment.findMany as jest.Mock).mockResolvedValue(mockPayments);

      const payments = await database.findAllPayments();

      expect(payments).toHaveLength(1);
      expect(payments[0]).toBeInstanceOf(Payment);
      expect(payments[0].getId()).toBe(1);
    });

    it('should throw a DatabaseError if findMany fails', async () => {
      (prismaMock.payment.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(database.findAllPayments()).rejects.toThrowError(
        'Failed to find payments',
      );
    });
  });

  describe('findPaymentById', () => {
    it('should return a payment by ID', async () => {
      (prismaMock.payment.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        externalId: '101',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
        orderId: 123,
        status: PaymentStatus.PENDING,
        price: new Decimal(200.75).toNumber(),
        pixQrCode: 'someQrCode',
        pixQrCodeBase64: 'someBase64',
      });

      const payment = await database.findPaymentById(1);

      expect(payment).toBeInstanceOf(Payment);
      expect(payment?.getId()).toBe(1);
    });

    it('should return null if payment is not found', async () => {
      (prismaMock.payment.findUnique as jest.Mock).mockResolvedValue(null);

      const payment = await database.findPaymentById(999);

      expect(payment).toBeNull();
    });

    it('should throw a DatabaseError if findUnique fails', async () => {
      (prismaMock.payment.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(database.findPaymentById(1)).rejects.toThrowError(
        'Failed to find payments',
      );
    });
  });

  // describe('createPayment', () => {
  //   it('should create a payment', async () => {
  //     const price = new Prisma.Decimal(200.50);
  //     const mockPrismaPayment = {
  //       id: 1,
  //       externalId: '101',
  //       createdAt: new Date('2024-01-01T00:00:00Z'),
  //       updatedAt: new Date('2024-01-02T00:00:00Z'),
  //       orderId: 123,
  //       status: new Decimal(200),//PaymentStatus.PENDING,
  //       price: price,
  //       pixQrCode: 'someQrCode',
  //       pixQrCodeBase64: 'someBase64',
  //     };

  //     (prismaMock.payment.create as jest.Mock).mockResolvedValue(
  //       mockPrismaPayment,
  //     );

  //     const payment = await database.createPayment(mockPayment);

  //     expect(payment).toBeInstanceOf(Payment);
  //     expect(payment.getId()).toBe(1);
  //   });

  //   it('should throw a DatabaseError if create fails', async () => {
  //     (prismaMock.payment.create as jest.Mock).mockRejectedValue(
  //       new Error('Database error'),
  //     );

  //     await expect(database.createPayment(mockPayment)).rejects.toThrowError(
  //       'Failed to save payment',
  //     );
  //   });
  // });

  describe('updatePaymentStatus', () => {
    it('should update the status of a payment', async () => {
      const mockUpdatedPayment = {
        ...mockPayment,
        status: PaymentStatus.SUCCESS,
      };

      (prismaMock.payment.update as jest.Mock).mockResolvedValue(
        mockUpdatedPayment,
      );

      const updatedPayment = await database.updatePaymentStatus(
        mockPayment,
      );

      expect(updatedPayment).toBeInstanceOf(Payment);
      expect(updatedPayment.getStatus()).toBe(PaymentStatus.SUCCESS);
    });

    it('should throw a DatabaseError if update fails', async () => {
      (prismaMock.payment.update as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        database.updatePaymentStatus(mockPayment),
      ).rejects.toThrowError('Failed to update payment status');
    });
  });
});
