export class GetOrderQuery {
  constructor(
    public readonly orderId: string,
    public readonly merchantId: string,
  ) {}
}
