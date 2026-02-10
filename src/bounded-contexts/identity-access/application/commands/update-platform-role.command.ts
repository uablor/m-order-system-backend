export class UpdatePlatformRoleCommand {
  constructor(
    public readonly id: string,
    public readonly payload: { name?: string },
  ) {}
}
