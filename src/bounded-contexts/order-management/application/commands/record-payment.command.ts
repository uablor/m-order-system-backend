export class RecordPaymentCommand {
  constructor(
    public readonly merchantId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly paymentDate: Date,
    public readonly customerOrderId?: string,
    public readonly reference?: string,
  ) {}
}
