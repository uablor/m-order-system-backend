import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerOrderCommand } from './delete-customer-order.command';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';

@CommandHandler(DeleteCustomerOrderCommand)
export class DeleteCustomerOrderHandler implements ICommandHandler<DeleteCustomerOrderCommand> {
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly repo: ICustomerOrderRepository,
  ) {}

  async execute(command: DeleteCustomerOrderCommand): Promise<void> {
    const aggregate = await this.repo.findById(command.id);
    if (!aggregate) throw new NotFoundException('Customer order not found');
    await this.repo.delete(command.id);
  }
}
