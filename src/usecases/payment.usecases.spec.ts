import { PaymentUseCases } from './payment.usecases';
import { IPaymentGateway } from '../interfaces/payment.gateway.interface';
import { IExternalPaymentGateway } from '../interfaces/external-payment.gateway.interface';
import { IMessagingGateway } from '../interfaces/messaging.gateway.interface';
import { Payment } from '../entities/payment.entity';
import { ExternalPayment } from 'src/entities/external-payment.entity';
import { PaymentStatus } from '../enum/payment-status.enum';
import { PaymentNotFoundError } from '../errors/payment-not-found.error';
import { InvalidPaymentStatusError } from '../errors/invalid-payment-status.error';

describe('PaymentUseCases', () => {
  let mockPaymentGateway: jest.Mocked<IPaymentGateway>;
  let mockExternalPaymentGateway: jest.Mocked<IExternalPaymentGateway>;
  let mockMessagingGateway: jest.Mocked<IMessagingGateway>;

  beforeEach(() => {
    mockPaymentGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
    };
    mockExternalPaymentGateway = {
      create: jest.fn(),
      isPaymentApproved: jest.fn(),
    };
    mockMessagingGateway = {
      publishPaymentStatusMessage: jest.fn(),
    };
  });

  describe('findById', () => {
    it('should return the payment if found', async () => {
      const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64');
      mockPaymentGateway.findById.mockResolvedValue(mockPayment);

      const payment = await PaymentUseCases.findById(mockPaymentGateway, 1);

      expect(payment).toEqual(mockPayment);
      expect(mockPaymentGateway.findById).toHaveBeenCalledTimes(1);
      expect(mockPaymentGateway.findById).toHaveBeenCalledWith(1);
    });

    it('should throw PaymentNotFoundError if payment is not found', async () => {
      mockPaymentGateway.findById.mockResolvedValue(null);

      await expect(PaymentUseCases.findById(mockPaymentGateway, 1)).rejects.toThrow(PaymentNotFoundError);
      expect(mockPaymentGateway.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new payment successfully', async () => {
      const externalPayment = new ExternalPayment(1, 100, 'PixQRCode', 'PixQRCodeBase64');
      mockExternalPaymentGateway.create.mockResolvedValue(externalPayment);
      const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'PixQRCode', 'PixQRCodeBase64');
      mockPaymentGateway.create.mockResolvedValue(mockPayment);

      const payment = await PaymentUseCases.create(mockPaymentGateway, mockExternalPaymentGateway, 123, 100);

      expect(payment).toEqual(mockPayment);
      expect(mockExternalPaymentGateway.create).toHaveBeenCalledTimes(1);
      expect(mockPaymentGateway.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateStatusOnPaymentReceived', () => {
    it('should update payment status to SUCCESS if payment is approved', async () => {
      const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64');
      mockPaymentGateway.findById.mockResolvedValue(mockPayment);
      mockExternalPaymentGateway.isPaymentApproved.mockResolvedValue(true);

      await PaymentUseCases.updateStatusOnPaymentReceived(
        mockPaymentGateway,
        mockExternalPaymentGateway,
        mockMessagingGateway,
        1,
      );

      expect(mockPayment.getStatus()).toBe(PaymentStatus.SUCCESS);
      expect(mockMessagingGateway.publishPaymentStatusMessage).toHaveBeenCalledWith(42, true);
      expect(mockPaymentGateway.updateStatus).toHaveBeenCalledWith(mockPayment);
    });

    it('should update payment status to FAIL if payment is not approved', async () => {
      const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64');
      mockPaymentGateway.findById.mockResolvedValue(mockPayment);
      mockExternalPaymentGateway.isPaymentApproved.mockResolvedValue(false);

      await PaymentUseCases.updateStatusOnPaymentReceived(
        mockPaymentGateway,
        mockExternalPaymentGateway,
        mockMessagingGateway,
        1,
      );
      expect(mockPayment.getStatus()).toBe(PaymentStatus.FAIL);
      expect(mockMessagingGateway.publishPaymentStatusMessage).toHaveBeenCalledWith(42, false);
      expect(mockPaymentGateway.updateStatus).toHaveBeenCalledWith(mockPayment);
    });

    it('should throw InvalidPaymentStatusError if payment status is not PENDING', async () => {
      const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64');
      mockPaymentGateway.findById.mockResolvedValue(mockPayment);

      await expect(
        PaymentUseCases.updateStatusOnPaymentReceived(
          mockPaymentGateway,
          mockExternalPaymentGateway,
          mockMessagingGateway,
          1,
        ),
      ).rejects.toThrow(InvalidPaymentStatusError);

      expect(mockPaymentGateway.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw PaymentNotFoundError if payment is not found', async () => {
      mockPaymentGateway.findById.mockResolvedValue(null);

      await expect(
        PaymentUseCases.updateStatusOnPaymentReceived(
          mockPaymentGateway,
          mockExternalPaymentGateway,
          mockMessagingGateway,
          1,
        ),
      ).rejects.toThrow(PaymentNotFoundError);

      expect(mockPaymentGateway.findById).toHaveBeenCalledTimes(1);
    });
    it('should handle the case when payment is already processed', async () => {
      const mockPayment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64');
      mockPaymentGateway.findById.mockResolvedValue(mockPayment);
  
      await expect(
        PaymentUseCases.updateStatusOnPaymentReceived(
          mockPaymentGateway,
          mockExternalPaymentGateway,
          mockMessagingGateway,
          1,
        ),
      ).rejects.toThrow(InvalidPaymentStatusError);
  
      expect(mockPaymentGateway.findById).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAll',()=>{
    it('should return a list of payments', async () => {
      const mockPayments: Payment[] = [];
      mockPayments.push(new Payment(1, 123, new Date(), new Date(), 42, 'PENDING', 100, 'QRcode', 'QRcodeB64'));
  
      mockPaymentGateway.findAll.mockResolvedValue(mockPayments);
  
      const payments = await PaymentUseCases.findAll(mockPaymentGateway);
  
      expect(payments).toEqual(mockPayments);
      expect(mockPaymentGateway.findAll).toHaveBeenCalledTimes(1);
    });
  
    it('should return an empty array if no payments exist', async () => {
      mockPaymentGateway.findAll.mockResolvedValue([]);
  
      const payments = await PaymentUseCases.findAll(mockPaymentGateway);
  
      expect(payments).toEqual([]);
      expect(mockPaymentGateway.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
