import type { OrderAggregate } from '../aggregates/order.aggregate';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryFindManyParams {
  merchantId: string;
  page?: number;
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
}

export interface IOrderRepository {
  save(aggregate: OrderAggregate): Promise<OrderAggregate>;
  findById(id: string, merchantId?: string): Promise<OrderAggregate | null>;
  findByOrderCode(orderCode: string, merchantId: string): Promise<OrderAggregate | null>;
  findMany(params: OrderRepositoryFindManyParams): Promise<{ data: OrderAggregate[]; total: number }>;
  delete(id: string): Promise<void>;
}
