export class CreateArrivalCommand {
  constructor(
    public readonly orderId: string,
    public readonly merchantId: string,
    public readonly arrivedDate: string,
    public readonly recordedBy: string,
    public readonly arrivedTime?: string,
    public readonly notes?: string,
  ) {}
}
