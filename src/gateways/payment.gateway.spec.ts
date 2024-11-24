import { PaymentGateway } from './payment.gateway';
import { IDatabase } from '../interfaces/database.interface';
import { Payment } from '../entities/payment.entity';
import { PaymentStatus } from '../enum/payment-status.enum';


jest.mock('../interfaces/database.interface'); 

describe('PaymentGateway', () => {
  let paymentGateway: PaymentGateway;
  let databaseMock: jest.Mocked<IDatabase>; 

  beforeEach(() => {
    databaseMock = {
      findAllPayments: jest.fn(),
      findPaymentById: jest.fn(),
      createPayment: jest.fn(),
      updatePaymentStatus: jest.fn(),
    };
    paymentGateway = new PaymentGateway(databaseMock);
  });

  it('should call findAllPayments and return all payments', async () => {
    const mockPayments: Payment[] = [
      new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64'),
      new Payment(2, 123, new Date(), new Date(), 2, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64')
    ];
    
    databaseMock.findAllPayments.mockResolvedValue(mockPayments);

    const result = await paymentGateway.findAll();

    expect(result).toEqual(mockPayments);
    expect(databaseMock.findAllPayments).toHaveBeenCalledTimes(1);
  });

  it('should call findPaymentById and return the payment for a valid id', async () => {
    const mockPayment: Payment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64');

    databaseMock.findPaymentById.mockResolvedValue(mockPayment);

    const result = await paymentGateway.findById(1);

    expect(result).toEqual(mockPayment);
    expect(databaseMock.findPaymentById).toHaveBeenCalledWith(1);
    expect(databaseMock.findPaymentById).toHaveBeenCalledTimes(1);
  });

  it('should return null if payment is not found by id', async () => {
    databaseMock.findPaymentById.mockResolvedValue(null);

    const result = await paymentGateway.findById(999);

    expect(result).toBeNull();
    expect(databaseMock.findPaymentById).toHaveBeenCalledWith(999);
    expect(databaseMock.findPaymentById).toHaveBeenCalledTimes(1);
  });

  it('should call createPayment and return the created payment', async () => {
    const mockPayment: Payment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64');

    databaseMock.createPayment.mockResolvedValue(mockPayment);

    const result = await paymentGateway.create(mockPayment);

    expect(result).toEqual(mockPayment);
    expect(databaseMock.createPayment).toHaveBeenCalledWith(mockPayment);
    expect(databaseMock.createPayment).toHaveBeenCalledTimes(1);
  });

  it('should call updatePaymentStatus and return the updated payment', async () => {
    const mockPayment: Payment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.PENDING, 100, 'QRcode', 'QRcodeB64');
    const updatedPayment: Payment = new Payment(1, 123, new Date(), new Date(), 42, PaymentStatus.SUCCESS, 100, 'QRcode', 'QRcodeB64');

    databaseMock.updatePaymentStatus.mockResolvedValue(updatedPayment);

    const result = await paymentGateway.updateStatus(updatedPayment);

    expect(result).toEqual(updatedPayment);
    expect(databaseMock.updatePaymentStatus).toHaveBeenCalledWith(updatedPayment);
    expect(databaseMock.updatePaymentStatus).toHaveBeenCalledTimes(1);
  });
});
