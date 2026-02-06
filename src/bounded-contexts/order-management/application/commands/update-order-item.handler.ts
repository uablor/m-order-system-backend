import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrderItemCommand } from './update-order-item.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';

@CommandHandler(UpdateOrderItemCommand)
export class UpdateOrderItemHandler implements ICommandHandler<UpdateOrderItemCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly coRepo: ICustomerOrderRepository,
  ) {}

  async execute(command: UpdateOrderItemCommand): Promise<void> {
    const order = await this.repo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const existing = order.items.find(
      (i) => (typeof i.id === 'string' ? i.id : i.id.value) === command.itemId,
    );
    if (!existing) throw new NotFoundException('Order item not found');
    const p = command.payload;
    const productName = p.productName ?? existing.productName;
    const variant = p.variant ?? existing.variant;
    const quantity = p.quantity ?? existing.quantity;
    if (p.quantity != null && p.quantity !== existing.quantity) {
      const allocated = await this.coRepo.sumAllocatedQuantityForOrderItem(command.itemId);
      if (p.quantity < allocated) {
        throw new BadRequestException(
          `Cannot reduce order item quantity below allocated quantity (${allocated})`,
        );
      }
    }
    const purchasePrice = p.purchasePrice ?? existing.purchasePrice;
    const purchaseExchangeRate = p.purchaseExchangeRate ?? existing.purchaseExchangeRate;
    const discountType = p.discountType ?? existing.discountType;
    const discountValue = p.discountValue ?? existing.discountValue;
    const sellingPriceForeign = p.sellingPriceForeign ?? existing.sellingPriceForeign;
    const sellingExchangeRate = p.sellingExchangeRate ?? existing.sellingExchangeRate;
    const updated = OrderItemEntity.createCalculated({
      id: existing.id,
      orderId: command.orderId,
      productName,
      variant,
      quantity,
      purchaseCurrency: existing.purchaseCurrency,
      purchasePrice,
      purchaseExchangeRate,
      discountType,
      discountValue,
      sellingPriceForeign,
      sellingExchangeRate,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
    order.updateItem(command.itemId, updated);
    await this.repo.save(order);
  }
}
