import { Prisma, PrismaClient, Payment as PrismaPayment} from '@prisma/client';
import { PrismaDatabase } from './prisma-database.external';
import { Payment } from '../entities/payment.entity';
import { DatabaseError } from '../errors/database.error';


const mockPayments: PrismaPayment[] = [
    {
      id: 1,
      externalId: BigInt(111),
      createdAt: new Date(),
      updatedAt: new Date(),
      orderId: 12,
      status: 'PENDING',
      price: new Prisma.Decimal(100),
      pixQrCode: 'qr1',
      pixQrCodeBase64: 'base64qr1',
    },
  ];
  
  const mockCreatedPayment: PrismaPayment = {
    id: 1,
    externalId: BigInt(111),
    createdAt: new Date(),
    updatedAt: new Date(),
    orderId: 12,
    status: 'PENDING',
    price: new Prisma.Decimal(100),
    pixQrCode: 'qr1',
    pixQrCodeBase64: 'base64qr1',
  };
  
  const mockUpdatedPayment: PrismaPayment = {
    id: 1,
    externalId: BigInt(111),
    createdAt: new Date(),
    updatedAt: new Date(),
    orderId: 12,
    status: 'SUCCESS', // Updated status
    price: new Prisma.Decimal(100),
    pixQrCode: 'qr1',
    pixQrCodeBase64: 'base64qr1',
  };
  
  // Mock Implementation
  jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn().mockImplementation(() => ({
        payment: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
        },
      })),
      Prisma: {
        PaymentStatus: {
          PENDING: 'PENDING',
          SUCCESS: 'SUCCESS',
        },
        Decimal: jest.fn().mockImplementation((value: number) => ({
          toString: () => value.toString(),
          toNumber: () => value,
        })),
      },
    };
  });
  
  describe('PrismaDatabase', () => {
    let prismaDatabase: PrismaDatabase;
    let prismaClientMock: jest.Mocked<PrismaClient>;
  
    beforeEach(() => {
      prismaClientMock = new PrismaClient() as jest.Mocked<PrismaClient>;
      prismaDatabase = new PrismaDatabase();
    });
  
    // describe('findAllPayments', () => {
    //   it('should return all payments', async () => {
    //     (prismaClientMock.payment.findMany as jest.Mock).mockResolvedValue(mockPayments);
  
    //     const result = await prismaDatabase.findAllPayments();

  
    //     expect(result).toHaveLength(1);
    //     expect(result[0]).toBeInstanceOf(Payment);  // Ensure Payment entity
    //     expect(result[0].getPrice()).toBe(100);  // Assuming Payment has this method
    //   });
  
    //   it('should throw a DatabaseError when it fails', async () => {
    //     (prismaClientMock.payment.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));
  
    //     await expect(prismaDatabase.findAllPayments()).rejects.toThrow(DatabaseError);
    //   });
    // });
  
    // describe('findPaymentById', () => {
    //   it('should return a payment by id', async () => {
    //     (prismaClientMock.payment.findUnique as jest.Mock).mockResolvedValue(mockPayments[0]);
  
    //     const result = await prismaDatabase.findPaymentById(1);
  
    //     expect(result).toBeInstanceOf(Payment);
    //     expect(result?.getPrice()).toBe(100);
    //   });
  
    //   it('should return null if payment not found', async () => {
    //     (prismaClientMock.payment.findUnique as jest.Mock).mockResolvedValue(null);
  
    //     const result = await prismaDatabase.findPaymentById(1);
  
    //     expect(result).toBeNull();
    //   });
  
    //   it('should throw a DatabaseError when it fails', async () => {
    //     (prismaClientMock.payment.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));
  
    //     await expect(prismaDatabase.findPaymentById(1)).rejects.toThrow(DatabaseError);
    //   });
    // });
  
    // describe('createPayment', () => {
    //   it('should create and return a payment', async () => {
    //     const paymentToCreate = new Payment(0, 123, new Date(), new Date(), 12, 'PENDING', 100, 'qr1', 'base64qr1');
    //     (prismaClientMock.payment.create as jest.Mock).mockResolvedValue(mockCreatedPayment);
  
    //     const result = await prismaDatabase.createPayment(paymentToCreate);
  
    //     expect(result).toBeInstanceOf(Payment);
    //     expect(result.getPrice()).toBe(100);
    //     expect(prismaClientMock.payment.create).toHaveBeenCalled();
    //   });
  
    //   it('should throw a DatabaseError when it fails', async () => {
    //     const paymentToCreate = new Payment(0, 123, new Date(), new Date(), 12, 'PENDING', 100, 'qr1', 'base64qr1');
    //     (prismaClientMock.payment.create as jest.Mock).mockRejectedValue(new Error('DB error'));
  
    //     await expect(prismaDatabase.createPayment(paymentToCreate)).rejects.toThrow(DatabaseError);
    //   });
    // });
  
    describe('updatePaymentStatus', () => {
    //   it('should update and return the updated payment', async () => {
    //     const paymentToUpdate = new Payment(1, 123, new Date(), new Date(), 12, 'PENDING', 100, 'qr1', 'base64qr1');
    //     (prismaClientMock.payment.update as jest.Mock).mockResolvedValue(mockUpdatedPayment);
  
    //     const result = await prismaDatabase.updatePaymentStatus(paymentToUpdate);
  
    //     expect(result).toBeInstanceOf(Payment);
    //     expect(result.getStatus()).toBe('PAID'); // Ensure proper status update
    //   });
  
    //   it('should return null if payment is not found', async () => {
    //     const paymentToUpdate = new Payment(1, 123, new Date(), new Date(), 12, 'PENDING', 100, 'qr1', 'base64qr1');
    //     (prismaClientMock.payment.update as jest.Mock).mockResolvedValue(null);
  
    //     const result = await prismaDatabase.updatePaymentStatus(paymentToUpdate);
  
    //     expect(result).toBeNull();
    //   });
  
      it('should throw a DatabaseError when it fails', async () => {
        const paymentToUpdate = new Payment(1, 123, new Date(), new Date(), 12, 'PENDING', 100, 'qr1', 'base64qr1');
        (prismaClientMock.payment.update as jest.Mock).mockRejectedValue(new Error('DB error'));
  
        await expect(prismaDatabase.updatePaymentStatus(paymentToUpdate)).rejects.toThrow(DatabaseError);
      });
    });
  });
  