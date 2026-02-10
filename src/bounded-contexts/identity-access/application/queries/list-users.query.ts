export class ListUsersQuery {
  constructor(
    public readonly merchantId?: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
