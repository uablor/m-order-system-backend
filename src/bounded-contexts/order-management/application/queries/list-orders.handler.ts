import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListOrdersQuery } from './list-orders.query';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import type { OrderEntity } from '../../domain/entities/order.entity';

export interface ListOrdersResult {
  data: OrderEntity[];
  total: number;
  page: number;
  limit: number;
}

@QueryHandler(ListOrdersQuery)
export class ListOrdersHandler implements IQueryHandler<ListOrdersQuery, ListOrdersResult> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: ListOrdersQuery): Promise<ListOrdersResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const fromDate = query.fromDate ? new Date(query.fromDate) : undefined;
    const toDate = query.toDate ? new Date(query.toDate) : undefined;
    const { data, total } = await this.orderRepository.findMany({
      merchantId: query.merchantId,
      page,
      limit,
      fromDate,
      toDate,
    });
    return { data, total, page, limit };
  }
}
