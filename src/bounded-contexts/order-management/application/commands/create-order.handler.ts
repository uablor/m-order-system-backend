import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { OrderEntity } from '../../domain/entities/order.entity';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand, OrderEntity> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderEntity> {
    const paidAmount = 0;
    const remainingAmount = command.totalSellingAmountLak;
    const paymentStatus = 'UNPAID';
    const order = OrderEntity.create({
      id: generateUuid(),
      merchantId: command.merchantId,
      createdBy: command.createdBy,
      orderCode: command.orderCode,
      orderDate: command.orderDate,
      arrivalStatus: command.arrivalStatus,
      totalFinalCostLak: command.totalFinalCostLak,
      totalFinalCostThb: command.totalFinalCostThb,
      totalSellingAmountLak: command.totalSellingAmountLak,
      totalSellingAmountThb: command.totalSellingAmountThb,
      paidAmount,
      remainingAmount,
      paymentStatus,
    });
    return this.orderRepository.save(order);
  }
}
