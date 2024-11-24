import { ExternalPaymentGateway } from './external-payment-gateway';
import { IExternalPayment } from '../interfaces/external-payment.interface';
import { ExternalPayment } from 'src/entities/external-payment.entity';

// Mock da interface IExternalPayment
jest.mock('../interfaces/external-payment.interface');

describe('ExternalPaymentGateway', () => {
  let externalPaymentGateway: ExternalPaymentGateway;
  let externalPaymentMethodMock: jest.Mocked<IExternalPayment>;

  beforeEach(() => {
    // Inicializa o mock de IExternalPayment
    externalPaymentMethodMock = {
      create: jest.fn(),
      isPaymentApproved: jest.fn(),
    };
    externalPaymentGateway = new ExternalPaymentGateway(externalPaymentMethodMock);
  });

  it('should call create on externalPaymentMethod with price and return the created external payment', async () => {
    const externalPayment = new ExternalPayment(1,100,"qrCode","QRCodeB64");
    externalPayment.setPrice(100);

    const mockCreatedPayment = new ExternalPayment(1,100,"qrCode","QRCodeB64");
    externalPaymentMethodMock.create.mockResolvedValue(mockCreatedPayment);

    const result = await externalPaymentGateway.create(externalPayment);

    expect(externalPaymentMethodMock.create).toHaveBeenCalledWith(100);
    expect(result).toEqual(mockCreatedPayment);
    expect(externalPaymentMethodMock.create).toHaveBeenCalledTimes(1);
  });

  it('should call isPaymentApproved and return true if payment is approved', async () => {
    const externalPaymentId = 123;

    externalPaymentMethodMock.isPaymentApproved.mockResolvedValue(true);

    const result = await externalPaymentGateway.isPaymentApproved(externalPaymentId);

    expect(externalPaymentMethodMock.isPaymentApproved).toHaveBeenCalledWith(externalPaymentId);
    expect(result).toBe(true);
    expect(externalPaymentMethodMock.isPaymentApproved).toHaveBeenCalledTimes(1);
  });

  it('should call isPaymentApproved and return false if payment is not approved', async () => {
    const externalPaymentId = 123;

    externalPaymentMethodMock.isPaymentApproved.mockResolvedValue(false);

    const result = await externalPaymentGateway.isPaymentApproved(externalPaymentId);

    expect(externalPaymentMethodMock.isPaymentApproved).toHaveBeenCalledWith(externalPaymentId);
    expect(result).toBe(false);
    expect(externalPaymentMethodMock.isPaymentApproved).toHaveBeenCalledTimes(1);
  });
});
