import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListDraftOrdersQuery } from './list-draft-orders.query';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListDraftOrdersQuery)
export class ListDraftOrdersHandler implements IQueryHandler<ListDraftOrdersQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(query: ListDraftOrdersQuery) {
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      status: 'DRAFT',
      page: query.page,
      limit: query.limit,
    });
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);
    return {
      data: data.map((a) => ({
        id: a.id.value,
        merchantId: a.merchantId,
        orderCode: a.orderCode,
        orderDate: a.orderDate,
        status: a.status,
        arrivalStatus: a.arrivalStatus,
        paymentStatus: a.paymentStatus,
        totalFinalCostLak: a.totalFinalCostLak,
        totalSellingAmountLak: a.totalSellingAmountLak,
        totalProfitLak: a.totalProfitLak,
        createdAt: a.createdAt,
      })),
      pagination,
    };
  }
}

