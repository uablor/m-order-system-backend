import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from './get-customer.query';
import { CUSTOMER_REPOSITORY, type ICustomerRepository } from '../../domain/repositories/customer.repository';
import type { CustomerEntity } from '../../domain/entities/customer.entity';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery, CustomerEntity> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(query: GetCustomerQuery): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findById(query.customerId);
    if (!customer) {
      throw new NotFoundException(`Customer not found: ${query.customerId}`, 'CUSTOMER_NOT_FOUND');
    }
    return customer;
  }
}
