import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from './get-customer.query';
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(query: GetCustomerQuery) {
    const customer = await this.customerRepo.findById(query.id);
    if (!customer)
      throw new NotFoundException(`Customer not found: ${query.id}`, 'CUSTOMER_NOT_FOUND');
    return {
      id: customer.id.value,
      merchantId: customer.merchantId,
      token: customer.token,
      fullName: customer.fullName,
      contactPhone: customer.contactPhone,
      contactEmail: customer.contactEmail,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
