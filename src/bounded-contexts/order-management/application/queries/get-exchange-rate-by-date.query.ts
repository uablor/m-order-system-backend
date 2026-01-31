export class GetExchangeRateByDateQuery {
  constructor(
    public readonly merchantId: string,
    public readonly rateDate: Date,
    public readonly rateType: 'BUY' | 'SELL',
    public readonly baseCurrency: string,
  ) {}
}
