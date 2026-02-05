export class UpdateOrderItemCommand {
  constructor(
    public readonly orderId: string,
    public readonly itemId: string,
    public readonly payload: {
      productName?: string;
      variant?: string;
      quantity?: number;
      purchasePrice?: number;
      purchaseExchangeRate?: number;
      discountType?: 'PERCENT' | 'FIX';
      discountValue?: number;
      sellingPriceForeign?: number;
      sellingExchangeRate?: number;
    },
  ) {}
}
