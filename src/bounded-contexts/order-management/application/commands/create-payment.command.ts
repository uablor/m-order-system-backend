export class CreatePaymentCommand {
  constructor(
    public readonly orderId: string,
    public readonly merchantId: string,
    public readonly customerId: string,
    public readonly paymentAmount: number,
    public readonly paymentDate: string,
    public readonly paymentMethod: string,
    public readonly paymentProofUrl?: string,
    public readonly paymentAt?: string,
    public readonly customerMessage?: string,
  ) {}
}
