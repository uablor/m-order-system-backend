import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerOrderCommand } from './create-customer-order.command';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { CustomerOrderAggregate } from '../../domain/aggregates/customer-order.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateCustomerOrderCommand)
export class CreateCustomerOrderHandler implements ICommandHandler<CreateCustomerOrderCommand> {
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly coRepo: ICustomerOrderRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(command: CreateCustomerOrderCommand): Promise<CustomerOrderAggregate> {
    const order = await this.orderRepo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const aggregate = CustomerOrderAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      orderId: command.orderId,
      customerId: command.customerId,
      merchantId: command.merchantId,
      totalSellingAmountLak: 0,
      totalPaid: 0,
      remainingAmount: 0,
      paymentStatus: 'UNPAID',
    });
    return this.coRepo.save(aggregate);
  }
}
