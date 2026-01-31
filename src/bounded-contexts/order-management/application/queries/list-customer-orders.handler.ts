import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomerOrdersQuery } from './list-customer-orders.query';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';

@QueryHandler(ListCustomerOrdersQuery)
export class ListCustomerOrdersHandler
  implements IQueryHandler<ListCustomerOrdersQuery>
{
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly repo: ICustomerOrderRepository,
  ) {}

  async execute(query: ListCustomerOrdersQuery) {
    return this.repo.findMany({
      merchantId: query.merchantId,
      customerId: query.customerId,
      page: query.page,
      limit: query.limit,
    });
  }
}
