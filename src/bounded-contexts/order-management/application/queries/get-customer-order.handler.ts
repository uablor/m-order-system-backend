import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerOrderQuery } from './get-customer-order.query';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';

@QueryHandler(GetCustomerOrderQuery)
export class GetCustomerOrderHandler
  implements IQueryHandler<GetCustomerOrderQuery>
{
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly repo: ICustomerOrderRepository,
  ) {}

  async execute(query: GetCustomerOrderQuery) {
    return this.repo.findById(query.id);
  }
}
