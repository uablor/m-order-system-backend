import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CalculateOrderCommand } from './calculate-order.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';

@CommandHandler(CalculateOrderCommand)
export class CalculateOrderHandler implements ICommandHandler<CalculateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(command: CalculateOrderCommand): Promise<void> {
    const order = await this.repo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    order.recalculateFromItems();
    await this.repo.save(order);
  }
}
