export class ListPlatformUsersQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
