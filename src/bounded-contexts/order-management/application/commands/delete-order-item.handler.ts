import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrderItemCommand } from './delete-order-item.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';

@CommandHandler(DeleteOrderItemCommand)
export class DeleteOrderItemHandler implements ICommandHandler<DeleteOrderItemCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly coRepo: ICustomerOrderRepository,
  ) {}

  async execute(command: DeleteOrderItemCommand): Promise<void> {
    const order = await this.repo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const hasItem = order.items.some(
      (i) => (typeof i.id === 'string' ? i.id : i.id.value) === command.itemId,
    );
    if (!hasItem) throw new NotFoundException('Order item not found');
    const allocated = await this.coRepo.sumAllocatedQuantityForOrderItem(command.itemId);
    if (allocated > 0) {
      throw new BadRequestException(
        `Cannot delete order item because it has allocated quantity (${allocated})`,
      );
    }
    order.removeItem(command.itemId);
    await this.repo.save(order);
  }
}
