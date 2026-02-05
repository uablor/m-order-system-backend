export class CreateExchangeRateCommand {
  constructor(
    public readonly merchantId: string,
    public readonly baseCurrency: string,
    public readonly targetCurrency: string,
    public readonly rateType: 'BUY' | 'SELL',
    public readonly rate: number,
    public readonly rateDate: string,
    public readonly createdBy: string,
    public readonly isActive?: boolean,
  ) {}
}
