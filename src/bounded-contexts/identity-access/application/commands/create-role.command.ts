export class CreateRoleCommand {
  constructor(
    public readonly name: string,
    public readonly merchantId: string | null,
    public readonly permissionIds: string[],
  ) {}
}
