export class ListCustomersQuery {
  constructor(
    public readonly merchantId: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
