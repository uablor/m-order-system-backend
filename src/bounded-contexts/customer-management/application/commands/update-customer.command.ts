export class UpdateCustomerCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      fullName?: string;
      contactPhone?: string;
      contactEmail?: string;
    },
  ) {}
}
