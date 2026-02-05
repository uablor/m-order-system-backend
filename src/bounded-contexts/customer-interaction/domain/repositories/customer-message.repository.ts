import type { CustomerMessageAggregate } from '../aggregates/customer-message.aggregate';

export const CUSTOMER_MESSAGE_REPOSITORY = Symbol('CUSTOMER_MESSAGE_REPOSITORY');

export interface CustomerMessageRepositoryFindManyParams {
  merchantId: string;
  customerId?: string;
  orderId?: string;
  page?: number;
  limit?: number;
}

export interface ICustomerMessageRepository {
  save(aggregate: CustomerMessageAggregate): Promise<CustomerMessageAggregate>;
  findById(id: string): Promise<CustomerMessageAggregate | null>;
  findMany(params: CustomerMessageRepositoryFindManyParams): Promise<{
    data: CustomerMessageAggregate[];
    total: number;
  }>;
}
