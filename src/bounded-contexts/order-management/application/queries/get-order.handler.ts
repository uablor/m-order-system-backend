import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from './get-order.query';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import type { OrderEntity } from '../../domain/entities/order.entity';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, OrderEntity> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(query.orderId, query.merchantId);
    if (!order) {
      throw new NotFoundException(`Order not found: ${query.orderId}`, 'ORDER_NOT_FOUND');
    }
    return order;
  }
}
