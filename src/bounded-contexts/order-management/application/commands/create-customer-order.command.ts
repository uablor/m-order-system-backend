export class CreateCustomerOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly merchantId: string,
  ) {}
}
