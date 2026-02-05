export class ListPaymentsQuery {
  constructor(
    public readonly merchantId: string,
    public readonly orderId?: string,
    public readonly customerId?: string,
    public readonly status?: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
