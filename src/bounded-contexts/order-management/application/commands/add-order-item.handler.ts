import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddOrderItemCommand } from './add-order-item.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

function computeItemTotals(
  quantity: number,
  purchasePrice: number,
  purchaseExchangeRate: number,
  discountType: 'PERCENT' | 'FIX',
  discountValue: number,
  sellingPriceForeign: number,
  sellingExchangeRate: number,
) {
  const purchaseTotalLak = quantity * purchasePrice * purchaseExchangeRate;
  const totalCostBeforeDiscountLak = purchaseTotalLak;
  const discountAmountLak =
    discountType === 'PERCENT'
      ? (totalCostBeforeDiscountLak * discountValue) / 100
      : discountValue;
  const finalCostLak = totalCostBeforeDiscountLak - discountAmountLak;
  const finalCostThb = purchaseExchangeRate > 0 ? finalCostLak / purchaseExchangeRate : 0;
  const sellingTotalLak = quantity * sellingPriceForeign * sellingExchangeRate;
  const profitLak = sellingTotalLak - finalCostLak;
  const profitThb = sellingExchangeRate > 0 ? profitLak / sellingExchangeRate : 0;
  return {
    purchaseTotalLak,
    totalCostBeforeDiscountLak,
    discountAmountLak,
    finalCostLak,
    finalCostThb,
    sellingTotalLak,
    profitLak,
    profitThb,
  };
}

@CommandHandler(AddOrderItemCommand)
export class AddOrderItemHandler implements ICommandHandler<AddOrderItemCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(command: AddOrderItemCommand): Promise<{ itemId: string }> {
    const order = await this.repo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const totals = computeItemTotals(
      command.quantity,
      command.purchasePrice,
      command.purchaseExchangeRate,
      command.discountType,
      command.discountValue,
      command.sellingPriceForeign,
      command.sellingExchangeRate,
    );
    const item = OrderItemEntity.create({
      id: UniqueEntityId.create(generateUuid()),
      orderId: command.orderId,
      productName: command.productName,
      variant: command.variant ?? '',
      quantity: command.quantity,
      purchaseCurrency: command.purchaseCurrency,
      purchasePrice: command.purchasePrice,
      purchaseExchangeRate: command.purchaseExchangeRate,
      purchaseTotalLak: totals.purchaseTotalLak,
      totalCostBeforeDiscountLak: totals.totalCostBeforeDiscountLak,
      discountType: command.discountType,
      discountValue: command.discountValue,
      discountAmountLak: totals.discountAmountLak,
      finalCostLak: totals.finalCostLak,
      finalCostThb: totals.finalCostThb,
      sellingPriceForeign: command.sellingPriceForeign,
      sellingExchangeRate: command.sellingExchangeRate,
      sellingTotalLak: totals.sellingTotalLak,
      profitLak: totals.profitLak,
      profitThb: totals.profitThb,
    });
    order.addItem(item);
    await this.repo.save(order);
    return { itemId: item.id.value };
  }
}
