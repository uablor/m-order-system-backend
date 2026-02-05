import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrderItemCommand } from './delete-order-item.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';

@CommandHandler(DeleteOrderItemCommand)
export class DeleteOrderItemHandler implements ICommandHandler<DeleteOrderItemCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(command: DeleteOrderItemCommand): Promise<void> {
    const order = await this.repo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const hasItem = order.items.some(
      (i) => (typeof i.id === 'string' ? i.id : i.id.value) === command.itemId,
    );
    if (!hasItem) throw new NotFoundException('Order item not found');
    order.removeItem(command.itemId);
    await this.repo.save(order);
  }
}
