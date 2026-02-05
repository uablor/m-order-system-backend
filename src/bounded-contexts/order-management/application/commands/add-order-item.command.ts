export class AddOrderItemCommand {
  constructor(
    public readonly orderId: string,
    public readonly productName: string,
    public readonly variant: string,
    public readonly quantity: number,
    public readonly purchaseCurrency: string,
    public readonly purchasePrice: number,
    public readonly purchaseExchangeRate: number,
    public readonly discountType: 'PERCENT' | 'FIX',
    public readonly discountValue: number,
    public readonly sellingPriceForeign: number,
    public readonly sellingExchangeRate: number,
  ) {}
}
