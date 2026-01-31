export class AddCustomerOrderItemCommand {
  constructor(
    public readonly customerOrderId: string,
    public readonly merchantId: string,
    public readonly productRef: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly currency: string,
  ) {}
}
