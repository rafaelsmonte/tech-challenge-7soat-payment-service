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
    // Mock dos dependentes
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
    // Arrange
    const mockPayments = [
      new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64'),
      new Payment(2, 124, new Date(), new Date(), 43, PaymentStatus.PENDING, 200, 'QRcode2', 'QRcodeB64-2'),
    ];
    mockDatabase.findAllPayments.mockResolvedValue(mockPayments);

    // Act
    const result = await PaymentController.findAll(mockDatabase);

    // Assert
    expect(result).toBe(JSON.stringify(mockPayments));
    expect(mockDatabase.findAllPayments).toHaveBeenCalledTimes(1);
  });

  it('should find a payment by id', async () => {
    // Arrange
    const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64');
    mockDatabase.findPaymentById.mockResolvedValue(mockPayment);

    // Act
    const result = await PaymentController.findById(mockDatabase, 1);

    // Assert
    expect(result).toBe(JSON.stringify(mockPayment));
    expect(mockDatabase.findPaymentById).toHaveBeenCalledWith(1);
    expect(mockDatabase.findPaymentById).toHaveBeenCalledTimes(1);
  });

  it('should create a payment', async () => {
    // Arrange
    const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64');
    mockDatabase.createPayment.mockResolvedValue(mockPayment);
    mockExternalPayment.create.mockResolvedValue(new ExternalPayment(1,100,'QRcode','QRcodeB64'));

    // Act
    const result = await PaymentController.create(mockDatabase, mockExternalPayment, 42, 100);

    // Assert
    expect(result).toBe(JSON.stringify(mockPayment));
    expect(mockDatabase.createPayment).toHaveBeenCalledTimes(1);
    expect(mockExternalPayment.create).toHaveBeenCalledWith(100);
  });

  it('should update payment status on payment received', async () => {
    // Arrange
    const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64');
    mockDatabase.findPaymentById.mockResolvedValue(mockPayment);
    mockExternalPayment.isPaymentApproved.mockResolvedValue(true);

    // Act
    await PaymentController.updateStatusOnPaymentReceived(mockDatabase, mockExternalPayment, mockMessaging, 1);

    // Assert
    expect(mockDatabase.updatePaymentStatus).toHaveBeenCalled();
    expect(mockMessaging.publishMessage).toHaveBeenCalled();
  });
});
