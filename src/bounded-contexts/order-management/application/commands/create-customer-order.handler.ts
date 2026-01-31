import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerOrderCommand } from './create-customer-order.command';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';
import { CustomerOrderAggregate } from '../../domain/aggregates/customer-order.aggregate';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateCustomerOrderCommand)
export class CreateCustomerOrderHandler
  implements ICommandHandler<CreateCustomerOrderCommand, CustomerOrderAggregate>
{
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly repo: ICustomerOrderRepository,
  ) {}

  async execute(command: CreateCustomerOrderCommand): Promise<CustomerOrderAggregate> {
    const aggregate = CustomerOrderAggregate.create({
      id: generateUuid(),
      merchantId: command.merchantId,
      customerId: command.customerId,
      orderId: command.orderId,
      orderCode: command.orderCode,
      orderDate: command.orderDate,
      status: 'PENDING',
      totalAmount: command.totalAmount,
      currency: command.currency,
      paymentStatus: 'UNPAID',
      items: [],
    });
    return this.repo.save(aggregate);
  }
}
