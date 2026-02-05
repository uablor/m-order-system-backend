export class AddArrivalItemCommand {
  constructor(
    public readonly arrivalId: string,
    public readonly orderItemId: string,
    public readonly arrivedQuantity: number,
    public readonly condition: 'OK' | 'DAMAGED' | 'LOST',
    public readonly notes?: string,
  ) {}
}
