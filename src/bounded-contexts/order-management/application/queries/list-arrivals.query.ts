export class ListArrivalsQuery {
  constructor(
    public readonly merchantId: string,
    public readonly orderId?: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
