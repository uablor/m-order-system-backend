export class UpdatePaymentCommand {
  constructor(
    public readonly id: string,
    public readonly payload: { notes?: string },
  ) {}
}
