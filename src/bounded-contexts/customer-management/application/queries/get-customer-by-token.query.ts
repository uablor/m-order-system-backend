export class GetCustomerByTokenQuery {
  constructor(
    public readonly token: string,
    public readonly merchantId?: string,
  ) {}
}
