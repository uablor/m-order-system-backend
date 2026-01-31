export class CreateCustomerCommand {
  constructor(
    public readonly merchantId: string,
    public readonly name: string,
    public readonly phone?: string,
    public readonly email?: string,
    public readonly address?: string,
  ) {}
}
