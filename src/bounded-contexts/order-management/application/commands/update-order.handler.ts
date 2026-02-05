import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrderCommand } from './update-order.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(command: UpdateOrderCommand): Promise<void> {
    const aggregate = await this.repo.findById(command.id);
    if (!aggregate) throw new NotFoundException('Order not found');
    aggregate.updateDetails(command.payload.orderCode, command.payload.orderDate);
    await this.repo.save(aggregate);
  }
}
