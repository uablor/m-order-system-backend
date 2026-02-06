export class ListDraftCustomerOrdersQuery {
  constructor(
    public readonly merchantId: string,
    public readonly customerId: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}

