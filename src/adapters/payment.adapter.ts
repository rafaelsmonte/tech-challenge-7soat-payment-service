import { Payment } from '../entities/payment.entity';

export const PaymentAdapter = {
  adaptArrayJson: (payments: Payment[]): string => {
    const mappedPayments = payments.map((payment) => {
      return {
        id: payment.getId(),
        externalId: payment.getExternalId(),
        createdAt: payment.getCreatedAt(),
        updatedAt: payment.getUpdatedAt(),
        orderId: payment.getOrderId(),
        status: payment.getStatus(),
        price: payment.getPrice(),
        pixQrCode: payment.getPixQrCode(),
        pixQrCodeBase64: payment.getPixQrCodeBase64(),
      };
    });

    return JSON.stringify(mappedPayments);
  },

  adaptJson: (payment: Payment | null): string => {
    if (!payment) return JSON.stringify({});

    const mappedPayment = {
      id: payment.getId(),
      externalId: payment.getExternalId(),
      createdAt: payment.getCreatedAt(),
      updatedAt: payment.getUpdatedAt(),
      orderId: payment.getOrderId(),
      status: payment.getStatus(),
      price: payment.getPrice(),
      pixQrCode: payment.getPixQrCode(),
      pixQrCodeBase64: payment.getPixQrCodeBase64(),
    };

    return JSON.stringify(mappedPayment);
  },
};
