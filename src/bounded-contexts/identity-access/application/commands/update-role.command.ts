export class UpdateRoleCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      name?: string;
      merchantId?: string | null;
      permissionIds?: string[];
    },
  ) {}
}
