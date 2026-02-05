export class GetExchangeRatesByDateQuery {
  constructor(
    public readonly merchantId: string,
    public readonly rateDate: string,
  ) {}
}
