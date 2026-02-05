export class ListNotificationsQuery {
  constructor(
    public readonly merchantId: string,
    public readonly customerId?: string,
    public readonly notificationType?: string,
    public readonly status?: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
