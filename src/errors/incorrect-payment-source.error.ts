export class IncorrectPaymentSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IncorrectPaymentSource';
  }
}
