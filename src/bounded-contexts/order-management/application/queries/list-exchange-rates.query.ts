export class ListExchangeRatesQuery {
  constructor(
    public readonly merchantId: string,
    public readonly page?: number,
    public readonly limit?: number,
    public readonly fromDate?: string,
    public readonly toDate?: string,
  ) {}
}
