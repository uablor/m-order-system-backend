export class CreateNotificationCommand {
  constructor(
    public readonly merchantId: string,
    public readonly customerId: string,
    public readonly notificationType: 'ARRIVAL' | 'PAYMENT' | 'REMINDER',
    public readonly channel: 'FB' | 'LINE' | 'WHATSAPP',
    public readonly recipientContact: string,
    public readonly messageContent: string,
    public readonly notificationLink?: string,
    public readonly relatedOrders?: string[],
  ) {}
}
