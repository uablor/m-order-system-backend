import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomersQuery } from './list-customers.query';
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../domain/repositories/customer.repository';

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<ListCustomersQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(query: ListCustomersQuery) {
    const { data, total } = await this.customerRepo.findMany({
      merchantId: query.merchantId,
      page: query.page,
      limit: query.limit,
    });
    return {
      data: data.map((c) => ({
        id: c.id.value,
        merchantId: c.merchantId,
        token: c.token,
        fullName: c.fullName,
        contactPhone: c.contactPhone,
        contactEmail: c.contactEmail,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      total,
    };
  }
}
