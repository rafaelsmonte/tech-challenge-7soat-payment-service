import { PaymentController } from './payment.controller';
import { IDatabase } from '../interfaces/database.interface';
import { IExternalPayment } from '../interfaces/external-payment.interface';
import { IMessaging } from '../interfaces/messaging.interface';
import { Payment } from '../entities/payment.entity';
import { PaymentStatus } from '../enum/payment-status.enum';
import { ExternalPayment } from 'src/entities/external-payment.entity';

describe('PaymentController', () => {
  let mockDatabase: jest.Mocked<IDatabase>;
  let mockExternalPayment: jest.Mocked<IExternalPayment>;
  let mockMessaging: jest.Mocked<IMessaging>;

  beforeEach(() => {
    mockDatabase = {
      findAllPayments: jest.fn(),
      findPaymentById: jest.fn(),
      createPayment: jest.fn(),
      updatePaymentStatus: jest.fn(),
    } as jest.Mocked<IDatabase>;

    mockExternalPayment = {
      create: jest.fn(),
      isPaymentApproved: jest.fn(),
    } as jest.Mocked<IExternalPayment>;

    mockMessaging = {
        send: jest.fn(),
        publishMessage: jest.fn(),
      } as jest.Mocked<IMessaging>;
  });

  it('should find all payments', async () => { 
    const mockPayments = [
      new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64'),
      new Payment(2, 124, new Date(), new Date(), 43, PaymentStatus.PENDING, 200, 'QRcode2', 'QRcodeB64-2'),
    ];
    mockDatabase.findAllPayments.mockResolvedValue(mockPayments);

    const result = await PaymentController.findAll(mockDatabase);

    expect(result).toBe(JSON.stringify(mockPayments));
    expect(mockDatabase.findAllPayments).toHaveBeenCalledTimes(1);
  });

  it('should find a payment by id', async () => {
    const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64');
    mockDatabase.findPaymentById.mockResolvedValue(mockPayment);

    const result = await PaymentController.findById(mockDatabase, 1);

    expect(result).toBe(JSON.stringify(mockPayment));
    expect(mockDatabase.findPaymentById).toHaveBeenCalledWith(1);
    expect(mockDatabase.findPaymentById).toHaveBeenCalledTimes(1);
  });

  it('should create a payment', async () => {
    const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64');
    mockDatabase.createPayment.mockResolvedValue(mockPayment);
    mockExternalPayment.create.mockResolvedValue(new ExternalPayment(1,100,'QRcode','QRcodeB64'));

    const result = await PaymentController.create(mockDatabase, mockExternalPayment, 42, 100);

    expect(result).toBe(JSON.stringify(mockPayment));
    expect(mockDatabase.createPayment).toHaveBeenCalledTimes(1);
    expect(mockExternalPayment.create).toHaveBeenCalledWith(100);
  });

  it('should update payment status on payment received', async () => {
    const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64');
    mockDatabase.findPaymentById.mockResolvedValue(mockPayment);
    mockExternalPayment.isPaymentApproved.mockResolvedValue(true);

    await PaymentController.updateStatusOnPaymentReceived(mockDatabase, mockExternalPayment, mockMessaging, 1);

    expect(mockDatabase.updatePaymentStatus).toHaveBeenCalled();
    expect(mockMessaging.publishMessage).toHaveBeenCalled();
  });
});
