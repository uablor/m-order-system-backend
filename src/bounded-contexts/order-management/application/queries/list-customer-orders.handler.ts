import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomerOrdersQuery } from './list-customer-orders.query';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListCustomerOrdersQuery)
export class ListCustomerOrdersHandler implements IQueryHandler<ListCustomerOrdersQuery> {
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly repo: ICustomerOrderRepository,
  ) {}

  async execute(query: ListCustomerOrdersQuery) {
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      orderId: query.orderId,
      customerId: query.customerId,
      page: query.page,
      limit: query.limit,
    });
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);
    return {
      data: data.map((a) => ({
        id: a.id.value,
        orderId: a.orderId,
        customerId: a.customerId,
        merchantId: a.merchantId,
        totalSellingAmountLak: a.totalSellingAmountLak,
        totalPaid: a.totalPaid,
        remainingAmount: a.remainingAmount,
        paymentStatus: a.paymentStatus,
        createdAt: a.createdAt,
      })),
      pagination,
    };
  }
}
