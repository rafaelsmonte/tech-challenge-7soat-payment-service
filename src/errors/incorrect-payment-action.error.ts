export class IncorrectPaymentActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IncorrectPaymentActionError';
  }
}
