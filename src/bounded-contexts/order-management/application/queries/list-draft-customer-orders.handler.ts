import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListDraftCustomerOrdersQuery } from './list-draft-customer-orders.query';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListDraftCustomerOrdersQuery)
export class ListDraftCustomerOrdersHandler
  implements IQueryHandler<ListDraftCustomerOrdersQuery>
{
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly repo: ICustomerOrderRepository,
  ) {}

  async execute(query: ListDraftCustomerOrdersQuery) {
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      customerId: query.customerId,
      status: 'DRAFT',
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
        status: a.status,
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

