export class CreateCustomerOrderCommand {
  constructor(
    public readonly merchantId: string,
    public readonly customerId: string,
    public readonly orderCode: string,
    public readonly orderDate: Date,
    public readonly totalAmount: number,
    public readonly currency: string,
    public readonly orderId?: string,
  ) {}
}
