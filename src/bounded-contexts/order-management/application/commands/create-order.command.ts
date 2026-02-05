export class CreateOrderCommand {
  constructor(
    public readonly merchantId: string,
    public readonly createdBy: string,
    public readonly orderCode: string,
    public readonly orderDate: string,
  ) {}
}
