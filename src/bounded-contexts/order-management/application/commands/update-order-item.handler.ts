import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrderItemCommand } from './update-order-item.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';

@CommandHandler(UpdateOrderItemCommand)
export class UpdateOrderItemHandler implements ICommandHandler<UpdateOrderItemCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
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
    const purchasePrice = p.purchasePrice ?? existing.purchasePrice;
    const purchaseExchangeRate = p.purchaseExchangeRate ?? existing.purchaseExchangeRate;
    const discountType = p.discountType ?? existing.discountType;
    const discountValue = p.discountValue ?? existing.discountValue;
    const sellingPriceForeign = p.sellingPriceForeign ?? existing.sellingPriceForeign;
    const sellingExchangeRate = p.sellingExchangeRate ?? existing.sellingExchangeRate;
    const purchaseTotalLak = quantity * purchasePrice * purchaseExchangeRate;
    const totalCostBeforeDiscountLak = purchaseTotalLak;
    const discountAmountLak =
      discountType === 'PERCENT' ? (totalCostBeforeDiscountLak * discountValue) / 100 : discountValue;
    const finalCostLak = totalCostBeforeDiscountLak - discountAmountLak;
    const finalCostThb = purchaseExchangeRate > 0 ? finalCostLak / purchaseExchangeRate : 0;
    const sellingTotalLak = quantity * sellingPriceForeign * sellingExchangeRate;
    const profitLak = sellingTotalLak - finalCostLak;
    const profitThb = sellingExchangeRate > 0 ? profitLak / sellingExchangeRate : 0;
    const updated = OrderItemEntity.create({
      id: existing.id,
      orderId: command.orderId,
      productName,
      variant,
      quantity,
      purchaseCurrency: existing.purchaseCurrency,
      purchasePrice,
      purchaseExchangeRate,
      purchaseTotalLak,
      totalCostBeforeDiscountLak,
      discountType,
      discountValue,
      discountAmountLak,
      finalCostLak,
      finalCostThb,
      sellingPriceForeign,
      sellingExchangeRate,
      sellingTotalLak,
      profitLak,
      profitThb,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
    order.updateItem(command.itemId, updated);
    await this.repo.save(order);
  }
}
