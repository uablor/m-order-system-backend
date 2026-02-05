export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly fullName: string,
    public readonly merchantId: string,
    public readonly roleId: string,
  ) {}
}
