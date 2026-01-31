import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddCustomerOrderItemCommand } from './add-customer-order-item.command';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';
import { CustomerOrderAggregate } from '../../domain/aggregates/customer-order.aggregate';
import { CustomerOrderItemEntity } from '../../domain/entities/customer-order-item.entity';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found-exception';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(AddCustomerOrderItemCommand)
export class AddCustomerOrderItemHandler
  implements ICommandHandler<AddCustomerOrderItemCommand>
{
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly repo: ICustomerOrderRepository,
  ) {}

  async execute(command: AddCustomerOrderItemCommand): Promise<void> {
    const order = await this.repo.findById(command.customerOrderId);
    if (!order) {
      throw new NotFoundException('Customer order', command.customerOrderId);
    }
    const totalPrice = command.quantity * command.unitPrice;
    const item = CustomerOrderItemEntity.create({
      id: generateUuid(),
      customerOrderId: command.customerOrderId,
      productRef: command.productRef,
      quantity: command.quantity,
      unitPrice: command.unitPrice,
      totalPrice,
      currency: command.currency,
    });
    const items = [...order.items, item];
    const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);
    const updated = CustomerOrderAggregate.fromPersistence({
      id: order.id,
      merchantId: order.merchantId,
      customerId: order.customerId,
      orderId: order.orderId,
      orderCode: order.orderCode,
      orderDate: order.orderDate,
      status: order.status,
      totalAmount,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
      items,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
    await this.repo.save(updated);
  }
}
