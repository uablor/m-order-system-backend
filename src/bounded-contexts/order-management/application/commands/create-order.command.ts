export class CreateOrderCommand {
  constructor(
    public readonly merchantId: string,
    public readonly createdBy: string,
    public readonly orderCode: string,
    public readonly orderDate: Date,
    public readonly arrivalStatus: string,
    public readonly totalFinalCostLak: number,
    public readonly totalFinalCostThb: number,
    public readonly totalSellingAmountLak: number,
    public readonly totalSellingAmountThb: number,
  ) {}
}
