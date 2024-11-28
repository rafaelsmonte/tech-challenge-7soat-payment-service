import { PaymentAdapter } from './payment.adapter';
import { Payment } from '../entities/payment.entity';

describe('PaymentAdapter', () => {
  const mockPayment = (): Payment =>
    ({
      getId: jest.fn().mockReturnValue(1),
      getExternalId: jest.fn().mockReturnValue('external-123'),
      getCreatedAt: jest.fn().mockReturnValue(new Date('2024-01-01')),
      getUpdatedAt: jest.fn().mockReturnValue(new Date('2024-01-02')),
      getOrderId: jest.fn().mockReturnValue(123),
      getStatus: jest.fn().mockReturnValue('APPROVED'),
      getPrice: jest.fn().mockReturnValue(100.5),
      getPixQrCode: jest.fn().mockReturnValue('QRCODE'),
      getPixQrCodeBase64: jest.fn().mockReturnValue('base64-string'),
    } as unknown as Payment);

  describe('adaptArrayJson', () => {
    it('should adapt an array of payments to JSON', () => {
      const payments = [mockPayment(), mockPayment()];
      const result = PaymentAdapter.adaptArrayJson(payments);

      const expectedJson = JSON.stringify([
        {
          id: 1,
          externalId: 'external-123',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
          orderId: 123,
          status: 'APPROVED',
          price: 100.5,
          pixQrCode: 'QRCODE',
          pixQrCodeBase64: 'base64-string',
        },
        {
          id: 1,
          externalId: 'external-123',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
          orderId: 123,
          status: 'APPROVED',
          price: 100.5,
          pixQrCode: 'QRCODE',
          pixQrCodeBase64: 'base64-string',
        },
      ]);

      expect(result).toBe(expectedJson);
    });

    it('should return an empty JSON array for an empty input', () => {
      const result = PaymentAdapter.adaptArrayJson([]);
      expect(result).toBe('[]');
    });
  });

  describe('adaptJson', () => {
    it('should adapt a single payment to JSON', () => {
      const payment = mockPayment();
      const result = PaymentAdapter.adaptJson(payment);

      const expectedJson = JSON.stringify({
        id: 1,
        externalId: 'external-123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        orderId: 123,
        status: 'APPROVED',
        price: 100.5,
        pixQrCode: 'QRCODE',
        pixQrCodeBase64: 'base64-string',
      });

      expect(result).toBe(expectedJson);
    });

    it('should return an empty JSON object for a null input', () => {
      const result = PaymentAdapter.adaptJson(null);
      expect(result).toBe('{}');
    });
  });
});
