export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      email?: string;
      password?: string;
      fullName?: string;
      roleId?: string;
      isActive?: boolean;
    },
  ) {}
}
