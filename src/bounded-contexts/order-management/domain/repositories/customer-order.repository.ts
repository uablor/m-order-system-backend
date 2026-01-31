import type { CustomerOrderAggregate } from '../aggregates/customer-order.aggregate';

export const CUSTOMER_ORDER_REPOSITORY = Symbol('CUSTOMER_ORDER_REPOSITORY');

export interface CustomerOrderRepositoryFindManyParams {
  merchantId: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export interface ICustomerOrderRepository {
  save(aggregate: CustomerOrderAggregate): Promise<CustomerOrderAggregate>;
  findById(id: string): Promise<CustomerOrderAggregate | null>;
  findMany(params: CustomerOrderRepositoryFindManyParams): Promise<{
    data: CustomerOrderAggregate[];
    total: number;
  }>;
}
