import { MercadoPago } from './mercado-pago-payment.external';
import { ExternalPayment } from '../entities/external-payment.entity';
import { ExternalPaymentError } from '../errors/external-payment.error';
import { MercadoPagoConfig, Payment as MercadoPagoPayment } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

jest.mock('mercadopago', () => ({
    MercadoPagoConfig: jest.fn(),
    Payment: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        get: jest.fn(),
    })),
}));

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid'),
}));

describe('MercadoPago', () => {
    const mockAccessToken = 'mocked-access-token';
    process.env.MERCADO_PAGO_ACCESS_TOKEN = mockAccessToken;

    let mercadoPago: MercadoPago;

    beforeEach(() => {
        jest.clearAllMocks();
        mercadoPago = new MercadoPago();
    });

    describe('create', () => {
        it('should create a payment and return an ExternalPayment instance', async () => {
            //Giver the following price
            const mockPrice = 100;
            const mockResponse = {
                id: '123456',
                point_of_interaction: {
                    transaction_data: {
                        qr_code: 'mocked-qr-code',
                        qr_code_base64: 'mocked-qr-code-base64',
                    },
                },
            };

            const mockCreate = jest.fn().mockResolvedValue(mockResponse);
            (MercadoPagoPayment as jest.Mock).mockImplementation(() => ({
                create: mockCreate,
            }));

            //When I create a payment on mercado pago
            const result = await mercadoPago.create(mockPrice);

            expect(MercadoPagoConfig).toHaveBeenCalledWith({ accessToken: mockAccessToken });
            expect(mockCreate).toHaveBeenCalledWith({
                body: {
                    transaction_amount: mockPrice,
                    description: '',
                    payment_method_id: 'pix',
                    payer: { email: 'stub@stub.com' },
                },
                requestOptions: { idempotencyKey: 'mocked-uuid' },
            });

            //Then I should receive an ExternalPayment instance
            expect(result).toBeInstanceOf(ExternalPayment);
            //And it should have the Id equal to 123456
            expect(result.getId()).toBe('123456');
            //And it should have the Price equal to 100
            expect(result.getPrice()).toBe(100);
            //And it should have the PixQrCode equal to mocked-qr-code
            expect(result.getPixQrCode()).toBe('mocked-qr-code');
            //And ir should have the PixQrCodeBase64 equal to mocked-qr-code-base64
            expect(result.getPixQrCodeBase64()).toBe('mocked-qr-code-base64');
        });

        it('should throw an ExternalPaymentError if payment creation fails', async () => {
            const mockCreate = jest.fn().mockRejectedValue(new Error('Payment creation failed'));
            (MercadoPagoPayment as jest.Mock).mockImplementation(() => ({
                create: mockCreate,
            }));

            await expect(mercadoPago.create(100)).rejects.toThrow(ExternalPaymentError);
        });

        it('should throw an ExternalPaymentError if response is invalid', async () => {
            const mockCreate = jest.fn().mockResolvedValue({});
            (MercadoPagoPayment as jest.Mock).mockImplementation(() => ({
                create: mockCreate,
            }));

            await expect(mercadoPago.create(100)).rejects.toThrow(ExternalPaymentError);
        });
    });

    describe('isPaymentApproved', () => {
        it('should return true if payment status is approved', async () => {
            const mockResponse = { status: 'approved' };
            const mockGet = jest.fn().mockResolvedValue(mockResponse);
            (MercadoPagoPayment as jest.Mock).mockImplementation(() => ({
                get: mockGet,
            }));

            const result = await mercadoPago.isPaymentApproved(123456);

            expect(MercadoPagoConfig).toHaveBeenCalledWith({ accessToken: mockAccessToken });
            expect(mockGet).toHaveBeenCalledWith({ id: 123456 });
            expect(result).toBe(true);
        });

        it('should return false if payment status is not approved', async () => {
            const mockResponse = { status: 'pending' };
            const mockGet = jest.fn().mockResolvedValue(mockResponse);
            (MercadoPagoPayment as jest.Mock).mockImplementation(() => ({
                get: mockGet,
            }));

            const result = await mercadoPago.isPaymentApproved(123456);

            expect(result).toBe(false);
        });

        it('should throw an ExternalPaymentError if fetching payment status fails', async () => {
            const mockGet = jest.fn().mockRejectedValue(new Error('Failed to fetch status'));
            (MercadoPagoPayment as jest.Mock).mockImplementation(() => ({
                get: mockGet,
            }));

            await expect(mercadoPago.isPaymentApproved(123456)).rejects.toThrow(ExternalPaymentError);
        });
    });
});
