import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomersByMerchantQuery } from './list-customers-by-merchant.query';
import { CUSTOMER_REPOSITORY, type ICustomerRepository } from '../../domain/repositories/customer.repository';
import type { CustomerEntity } from '../../domain/entities/customer.entity';

@QueryHandler(ListCustomersByMerchantQuery)
export class ListCustomersByMerchantHandler
  implements IQueryHandler<ListCustomersByMerchantQuery, CustomerEntity[]>
{
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(query: ListCustomersByMerchantQuery): Promise<CustomerEntity[]> {
    return this.customerRepository.findByMerchant(query.merchantId);
  }
}
