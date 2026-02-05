export class ListMerchantsQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
