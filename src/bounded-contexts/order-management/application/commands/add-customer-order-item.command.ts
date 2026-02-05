export class AddCustomerOrderItemCommand {
  constructor(
    public readonly customerOrderId: string,
    public readonly orderItemId: string,
    public readonly quantity: number,
    public readonly sellingPriceForeign: number,
    public readonly sellingExchangeRate: number,
  ) {}
}
