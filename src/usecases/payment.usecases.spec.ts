import { PaymentUseCases } from './payment.usecases';
import { IPaymentGateway } from '../interfaces/payment.gateway.interface';
import { Payment } from '../entities/payment.entity';


describe('PaymentUseCases', () => {
  let mockPaymentGateway: jest.Mocked<IPaymentGateway>;

  beforeEach(() => {
    mockPaymentGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
    };
  });

  it('should return a list of payments', async () => {
    const mockPayments: Payment[] = [];

    mockPayments.push(new Payment(1,123, new Date(),new Date(), 42,'PENDING',100,"QRcode","QRcodeB64"))


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
