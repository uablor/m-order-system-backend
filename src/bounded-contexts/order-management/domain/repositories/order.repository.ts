import type { OrderAggregate } from '../aggregates/order.aggregate';
import type { OrderStatus } from '../value-objects/order-status.vo';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryFindManyParams {
  merchantId: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
}

export interface IOrderRepository {
  save(aggregate: OrderAggregate): Promise<OrderAggregate>;
  /** @param domainId - Business identity (UUID). Never DB technical id. */
  findById(domainId: string, merchantId?: string): Promise<OrderAggregate | null>;
  findByOrderCode(orderCode: string, merchantId: string): Promise<OrderAggregate | null>;
  findMany(params: OrderRepositoryFindManyParams): Promise<{ data: OrderAggregate[]; total: number }>;
  /** @param domainId - Business identity (UUID). */
  delete(domainId: string): Promise<void>;
}
