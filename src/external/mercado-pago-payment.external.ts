import { IExternalPayment } from '../interfaces/external-payment.interface';
import { MercadoPagoConfig, Payment as MercadoPagoPayment } from 'mercadopago';
import { PaymentError } from '../errors/payment.error';
import { v4 as uuidv4 } from 'uuid';
import { ExternalPayment } from '../entities/external-payment.entity';

export class MercadoPago implements IExternalPayment {
  async create(price: number): Promise<ExternalPayment> {
    try {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
      });
      const payment = new MercadoPagoPayment(client);

      const requestOptions = { idempotencyKey: uuidv4() };
      const body = {
        transaction_amount: price,
        description: '',
        payment_method_id: 'pix',
        payer: {
          email: 'stub@stub.com',
        },
      };

      const paymentResponse = await payment.create({ body, requestOptions });

      const paymentId = paymentResponse?.id;

      const pixQrCode =
        paymentResponse?.point_of_interaction?.transaction_data?.qr_code;

      const pixQrCodeBase64 =
        paymentResponse?.point_of_interaction?.transaction_data?.qr_code_base64;

      if (!paymentId || !pixQrCode || !pixQrCodeBase64)
        throw new PaymentError('Failed to create payment');

      return new ExternalPayment(paymentId, price, pixQrCode, pixQrCodeBase64);
    } catch (error: any) {
      console.log(error);
      throw new PaymentError('Failed to create payment');
    }
  }

  async isPaymentApproved(externalPaymentId: number): Promise<boolean> {
    try {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
      });
      const payment = new MercadoPagoPayment(client);

      const paymentResponse = await payment.get({
        id: externalPaymentId,
      });

      return paymentResponse.status === 'approved';
    } catch (error) {
      throw new PaymentError('Failed to check payment status');
    }
  }
}
