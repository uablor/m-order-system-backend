export interface ArrivalItemInput {
  orderItemId: string;
  quantityReceived: number;
  condition: string;
}

export class RecordArrivalCommand {
  constructor(
    public readonly orderId: string,
    public readonly arrivalDate: Date,
    public readonly items: ArrivalItemInput[],
    public readonly notes?: string,
  ) {}
}
