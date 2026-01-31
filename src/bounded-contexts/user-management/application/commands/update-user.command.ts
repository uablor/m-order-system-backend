export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly password?: string,
    public readonly fullName?: string,
    public readonly roleId?: string,
    public readonly isActive?: boolean,
  ) {}
}
