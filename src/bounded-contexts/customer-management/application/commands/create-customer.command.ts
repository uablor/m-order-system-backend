export class CreateCustomerCommand {
  constructor(
    public readonly merchantId: string,
    public readonly fullName: string,
    public readonly contactPhone?: string,
    public readonly contactEmail?: string,
    public readonly token?: string,
  ) {}
}
