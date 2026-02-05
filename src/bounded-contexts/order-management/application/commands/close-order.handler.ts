import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CloseOrderCommand } from './close-order.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';

@CommandHandler(CloseOrderCommand)
export class CloseOrderHandler implements ICommandHandler<CloseOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(command: CloseOrderCommand): Promise<void> {
    const order = await this.repo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    order.close();
    await this.repo.save(order);
  }
}
