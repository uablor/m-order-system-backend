export class PaginateMerchantsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
