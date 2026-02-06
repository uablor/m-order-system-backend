import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddOrderItemCommand } from './add-order-item.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(AddOrderItemCommand)
export class AddOrderItemHandler implements ICommandHandler<AddOrderItemCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(command: AddOrderItemCommand): Promise<{ itemId: string }> {
    const order = await this.repo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const item = OrderItemEntity.createCalculated({
      id: UniqueEntityId.create(generateUuid()),
      orderId: command.orderId,
      productName: command.productName,
      variant: command.variant ?? '',
      quantity: command.quantity,
      purchaseCurrency: command.purchaseCurrency,
      purchasePrice: command.purchasePrice,
      purchaseExchangeRate: command.purchaseExchangeRate,
      discountType: command.discountType,
      discountValue: command.discountValue,
      sellingPriceForeign: command.sellingPriceForeign,
      sellingExchangeRate: command.sellingExchangeRate,
    });
    order.addItem(item);
    await this.repo.save(order);
    return { itemId: item.id.value };
  }
}
