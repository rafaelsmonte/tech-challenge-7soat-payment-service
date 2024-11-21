export class ExternalPayment {
  private id: number;
  private price: number;
  private pixQrCode: string;
  private pixQrCodeBase64: string;

  constructor(
    id: number,
    price: number,
    pixQrCode: string,
    pixQrCodeBase64: string,
  ) {
    this.setId(id);
    this.setPrice(price);
    this.setPixQrCode(pixQrCode);
    this.setPixQrCodeBase64(pixQrCodeBase64);
  }

  static new(price: number): ExternalPayment {
    return new ExternalPayment(0, price, '', '');
  }

  // getters
  public getId(): number {
    return this.id;
  }

  public getPrice(): number {
    return this.price;
  }

  public getPixQrCode(): string {
    return this.pixQrCode;
  }

  public getPixQrCodeBase64(): string {
    return this.pixQrCodeBase64;
  }

  // setters
  public setId(id: number): void {
    this.id = id;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public setPixQrCode(pixQrCode: string): void {
    this.pixQrCode = pixQrCode;
  }

  public setPixQrCodeBase64(pixQrCodeBase64: string): void {
    this.pixQrCodeBase64 = pixQrCodeBase64;
  }
}
