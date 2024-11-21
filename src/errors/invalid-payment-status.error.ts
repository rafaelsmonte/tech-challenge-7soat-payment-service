export class InvalidPaymentStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPaymentStatusError';
  }
}
