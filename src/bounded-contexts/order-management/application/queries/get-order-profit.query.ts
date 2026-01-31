export class GetOrderProfitQuery {
  constructor(
    public readonly orderId: string,
    public readonly merchantId: string,
  ) {}
}
