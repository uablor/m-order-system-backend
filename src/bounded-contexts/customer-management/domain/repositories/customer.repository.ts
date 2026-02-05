import type { CustomerAggregate } from '../aggregates/customer.aggregate';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerRepositoryFindManyParams {
  merchantId: string;
  page?: number;
  limit?: number;
}

export interface ICustomerRepository {
  save(customer: CustomerAggregate): Promise<CustomerAggregate>;
  findById(id: string): Promise<CustomerAggregate | null>;
  findByToken(token: string, merchantId?: string): Promise<CustomerAggregate | null>;
  findMany(params: CustomerRepositoryFindManyParams): Promise<{
    data: CustomerAggregate[];
    total: number;
  }>;
  delete(id: string): Promise<void>;
}
