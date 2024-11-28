export class ExternalPaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExternalPaymentError';
  }
}
