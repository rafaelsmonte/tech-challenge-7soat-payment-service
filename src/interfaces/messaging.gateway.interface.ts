export interface IMessagingGateway {
  publishPaymentStatusMessage(orderId: number, success: boolean): Promise<void>;
}
