import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { OrderAggregate } from '../../domain/aggregates/order.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderAggregate> {
    const existing = await this.repo.findByOrderCode(command.orderCode, command.merchantId);
    if (existing) throw new ConflictException('Order code already exists for this merchant');
    const orderDate = new Date(command.orderDate);
    const aggregate = OrderAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      merchantId: command.merchantId,
      createdBy: command.createdBy,
      orderCode: command.orderCode,
      orderDate,
      arrivalStatus: 'NOT_ARRIVED',
      totalPurchaseCostLak: 0,
      totalShippingCostLak: 0,
      totalCostBeforeDiscountLak: 0,
      totalDiscountLak: 0,
      totalFinalCostLak: 0,
      totalFinalCostThb: 0,
      totalSellingAmountLak: 0,
      totalSellingAmountThb: 0,
      totalProfitLak: 0,
      totalProfitThb: 0,
      depositAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      paymentStatus: 'UNPAID',
      isClosed: false,
    });
    return this.repo.save(aggregate);
  }
}
