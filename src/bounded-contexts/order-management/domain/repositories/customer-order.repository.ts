import type { CustomerOrderAggregate } from '../aggregates/customer-order.aggregate';
import type { CustomerOrderStatus } from '../value-objects/customer-order-status.vo';

export const CUSTOMER_ORDER_REPOSITORY = Symbol('CUSTOMER_ORDER_REPOSITORY');

export interface CustomerOrderRepositoryFindManyParams {
  merchantId: string;
  orderId?: string;
  customerId?: string;
  status?: CustomerOrderStatus;
  page?: number;
  limit?: number;
}

export interface ICustomerOrderRepository {
  save(aggregate: CustomerOrderAggregate): Promise<CustomerOrderAggregate>;
  findById(id: string): Promise<CustomerOrderAggregate | null>;
  /** Total allocated quantity across all customer orders for given order item id. */
  sumAllocatedQuantityForOrderItem(orderItemId: string): Promise<number>;
  findMany(params: CustomerOrderRepositoryFindManyParams): Promise<{
    data: CustomerOrderAggregate[];
    total: number;
  }>;
  delete(id: string): Promise<void>;
}
