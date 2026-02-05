export class GetOrderQuery {
  constructor(
    public readonly id: string,
    public readonly merchantId?: string,
  ) {}
}
