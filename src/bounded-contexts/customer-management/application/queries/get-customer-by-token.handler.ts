import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerByTokenQuery } from './get-customer-by-token.query';
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetCustomerByTokenQuery)
export class GetCustomerByTokenHandler implements IQueryHandler<GetCustomerByTokenQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(query: GetCustomerByTokenQuery) {
    const customer = await this.customerRepo.findByToken(query.token, query.merchantId);
    if (!customer)
      throw new NotFoundException(`Customer not found for token`, 'CUSTOMER_NOT_FOUND');
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
