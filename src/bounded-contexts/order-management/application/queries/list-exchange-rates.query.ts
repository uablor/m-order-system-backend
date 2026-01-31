export class ListExchangeRatesQuery {
  constructor(
    public readonly merchantId: string,
    public readonly rateDate?: Date,
    public readonly rateType?: 'BUY' | 'SELL',
    public readonly baseCurrency?: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
