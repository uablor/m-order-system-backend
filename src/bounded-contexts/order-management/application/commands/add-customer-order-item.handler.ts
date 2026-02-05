import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddCustomerOrderItemCommand } from './add-customer-order-item.command';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { CustomerOrderItemEntity } from '../../domain/entities/customer-order-item.entity';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(AddCustomerOrderItemCommand)
export class AddCustomerOrderItemHandler implements ICommandHandler<AddCustomerOrderItemCommand> {
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly coRepo: ICustomerOrderRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(command: AddCustomerOrderItemCommand): Promise<{ itemId: string }> {
    const customerOrder = await this.coRepo.findById(command.customerOrderId);
    if (!customerOrder) throw new NotFoundException('Customer order not found');
    const order = await this.orderRepo.findById(customerOrder.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const orderItem = order.items.find(
      (i) => (typeof i.id === 'string' ? i.id : i.id.value) === command.orderItemId,
    );
    if (!orderItem) throw new NotFoundException('Order item not found');
    const allocatedQty = customerOrder.items
      .filter((i) => i.orderItemId === command.orderItemId)
      .reduce((s, i) => s + i.quantity, 0);
    const remaining = orderItem.getRemainingQuantity(allocatedQty);
    if (command.quantity > remaining) {
      throw new BadRequestException(
        `Cannot allocate more than remaining quantity (${remaining}) for this order item`,
      );
    }
    const sellingTotalLak = command.quantity * command.sellingPriceForeign * command.sellingExchangeRate;
    const costPerUnit = orderItem.finalCostLak / orderItem.quantity;
    const allocatedCost = costPerUnit * command.quantity;
    const profitLak = sellingTotalLak - allocatedCost;
    const item = CustomerOrderItemEntity.create({
      id: UniqueEntityId.create(generateUuid()),
      customerOrderId: command.customerOrderId,
      orderItemId: command.orderItemId,
      quantity: command.quantity,
      sellingPriceForeign: command.sellingPriceForeign,
      sellingTotalLak,
      profitLak,
    });
    customerOrder.addItem(item);
    await this.coRepo.save(customerOrder);
    return { itemId: item.id.value };
  }
}
