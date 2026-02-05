export class UpdateOrderCommand {
  constructor(
    public readonly id: string,
    public readonly payload: { orderCode?: string; orderDate?: Date },
  ) {}
}
