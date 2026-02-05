export class CreateMessageCommand {
  constructor(
    public readonly customerId: string,
    public readonly merchantId: string,
    public readonly messageType: 'TEXT' | 'IMAGE',
    public readonly messageContent: string,
    public readonly orderId?: string,
    public readonly fileUrl?: string,
  ) {}
}
