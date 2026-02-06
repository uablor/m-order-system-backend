import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrderCommand } from './delete-order.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler implements ICommandHandler<DeleteOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly coRepo: ICustomerOrderRepository,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    const aggregate = await this.repo.findById(command.id);
    if (!aggregate) throw new NotFoundException('Order not found');
    const { total } = await this.coRepo.findMany({
      merchantId: aggregate.merchantId,
      orderId: command.id,
      page: 1,
      limit: 1,
    });
    if (total > 0) {
      throw new BadRequestException('Cannot delete order with existing customer orders');
    }
    await this.repo.delete(command.id);
  }
}
