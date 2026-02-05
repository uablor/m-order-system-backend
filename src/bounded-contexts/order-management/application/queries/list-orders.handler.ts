import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListOrdersQuery } from './list-orders.query';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListOrdersQuery)
export class ListOrdersHandler implements IQueryHandler<ListOrdersQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(query: ListOrdersQuery) {
    const fromDate = query.fromDate ? new Date(query.fromDate) : undefined;
    const toDate = query.toDate ? new Date(query.toDate) : undefined;
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      page: query.page,
      limit: query.limit,
      fromDate,
      toDate,
    });
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);
    return {
      data: data.map((a) => ({
        id: a.id.value,
        merchantId: a.merchantId,
        orderCode: a.orderCode,
        orderDate: a.orderDate,
        arrivalStatus: a.arrivalStatus,
        paymentStatus: a.paymentStatus,
        totalFinalCostLak: a.totalFinalCostLak,
        totalSellingAmountLak: a.totalSellingAmountLak,
        totalProfitLak: a.totalProfitLak,
        isClosed: a.isClosed,
        createdAt: a.createdAt,
      })),
      pagination,
    };
  }
}
