export interface IMessagingGateway {
  publishPaymentStatusMessage(orderId: string, success: boolean): Promise<void>;
}
