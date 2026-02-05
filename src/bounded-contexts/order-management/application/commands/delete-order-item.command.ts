export class DeleteOrderItemCommand {
  constructor(
    public readonly orderId: string,
    public readonly itemId: string,
  ) {}
}
