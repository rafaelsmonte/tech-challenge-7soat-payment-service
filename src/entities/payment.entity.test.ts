import { Payment } from './payment.entity';
import { PaymentStatus } from '../enum/payment-status.enum';

describe('Payment', () => {
  let payment: Payment;

  beforeEach(() => {
    // Criando uma instância de Payment com valores iniciais
    payment = new Payment(
      1, 123, new Date(), new Date(), 42, 'PENDING', 100, 'QRcode', 'QRcodeB64'
    );
  });

  it('should create a new Payment object using static method', () => {
    const externalId = 123;
    const price = 100;
    const orderId = 42;
    const status = PaymentStatus.PENDING;
    const pixQrCode = 'QRcode';
    const pixQrCodeBase64 = 'QRcodeB64';

    const newPayment = Payment.new(externalId, price, orderId, status, pixQrCode, pixQrCodeBase64);

    expect(newPayment.getExternalId()).toBe(externalId);
    expect(newPayment.getPrice()).toBe(price);
    expect(newPayment.getOrderId()).toBe(orderId);
    expect(newPayment.getStatus()).toBe(status);
    expect(newPayment.getPixQrCode()).toBe(pixQrCode);
    expect(newPayment.getPixQrCodeBase64()).toBe(pixQrCodeBase64);
    expect(newPayment.getId()).toBe(0); // O id deve ser 0 porque é novo
  });

  it('should return correct values from getters', () => {
    expect(payment.getId()).toBe(1);
    expect(payment.getExternalId()).toBe(123);
    expect(payment.getCreatedAt()).toBeInstanceOf(Date);
    expect(payment.getUpdatedAt()).toBeInstanceOf(Date);
    expect(payment.getOrderId()).toBe(42);
    expect(payment.getStatus()).toBe('PENDING');
    expect(payment.getPrice()).toBe(100);
    expect(payment.getPixQrCode()).toBe('QRcode');
    expect(payment.getPixQrCodeBase64()).toBe('QRcodeB64');
  });

  it('should correctly set the id using setter', () => {
    payment.setId(10);
    expect(payment.getId()).toBe(10);
  });

  it('should correctly set the externalId using setter', () => {
    payment.setExternalId(999);
    expect(payment.getExternalId()).toBe(999);
  });

  it('should correctly set the price using setter', () => {
    payment.setPrice(200);
    expect(payment.getPrice()).toBe(200);
  });

  it('should correctly set the orderId using setter', () => {
    payment.setOrderId(50);
    expect(payment.getOrderId()).toBe(50);
  });

  it('should correctly set the status using setter', () => {
    payment.setStatus('SUCCESS');
    expect(payment.getStatus()).toBe(PaymentStatus.SUCCESS);
  });

  it('should correctly set the pixQrCode using setter', () => {
    payment.setPixQrCode('NewQRcode');
    expect(payment.getPixQrCode()).toBe('NewQRcode');
  });

  it('should correctly set the pixQrCodeBase64 using setter', () => {
    payment.setPixQrCodeBase64('NewQRcodeB64');
    expect(payment.getPixQrCodeBase64()).toBe('NewQRcodeB64');
  });

  it('should correctly set the updatedAt value using setter', () => {
    const newDate = new Date('2024-01-01');
    payment.setUpdatedAt(newDate);
    expect(payment.getUpdatedAt()).toBe(newDate);
  });
});
