import { PaymentStatus } from '../enum/payment-status.enum';

export class Payment {
  private id: number;
  private externalId: number;
  private createdAt: Date;
  private updatedAt: Date;
  private orderId: number;
  private status: PaymentStatus;
  private price: number;
  private pixQrCode: string;
  private pixQrCodeBase64: string;

  constructor(
    id: number,
    externalId: number,
    createdAt: Date,
    updateAt: Date,
    orderId: number,
    status: string,
    price: number,
    pixQrCode: string,
    pixQrCodeBase64: string,
  ) {
    this.setId(id);
    this.setExternalId(externalId);
    this.setCreatedAt(createdAt);
    this.setUpdatedAt(updateAt);
    this.setOrderId(orderId);
    this.setStatus(status);
    this.setPrice(price);
    this.setPixQrCode(pixQrCode);
    this.setPixQrCodeBase64(pixQrCodeBase64);
  }

  static new(
    externalId: number,
    price: number,
    orderId: number,
    status: PaymentStatus,
    pixQrCode: string,
    pixQrCodeBase64: string,
  ): Payment {
    const now = new Date();
    return new Payment(
      0,
      externalId,
      now,
      now,
      orderId,
      status,
      price,
      pixQrCode,
      pixQrCodeBase64,
    );
  }

  // getters
  public getId(): number {
    return this.id;
  }

  public getExternalId(): number {
    return this.externalId;
  }

  public getPrice(): number {
    return this.price;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getOrderId(): number {
    return this.orderId;
  }

  public getStatus(): string {
    return this.status;
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

  public setExternalId(externalId: number): void {
    this.externalId = externalId;
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  public setOrderId(orderId: number): void {
    this.orderId = orderId;
  }

  public setStatus(status: string): void {
    this.status = PaymentStatus[status];
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
