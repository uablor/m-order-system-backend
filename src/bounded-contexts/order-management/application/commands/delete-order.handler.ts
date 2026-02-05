import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrderCommand } from './delete-order.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler implements ICommandHandler<DeleteOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    const aggregate = await this.repo.findById(command.id);
    if (!aggregate) throw new NotFoundException('Order not found');
    await this.repo.delete(command.id);
  }
}
