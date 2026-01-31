export class SendNotificationCommand {
  constructor(
    public readonly merchantId: string,
    public readonly customerId: string,
    public readonly type: string,
    public readonly channel: string,
    public readonly title: string,
    public readonly body: string,
  ) {}
}
