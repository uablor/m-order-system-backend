import type { OrderEntity } from '../entities/order.entity';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryFindManyParams {
  merchantId: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface IOrderRepository {
  save(order: OrderEntity): Promise<OrderEntity>;
  findById(id: string, merchantId: string): Promise<OrderEntity | null>;
  findByOrderCode(orderCode: string, merchantId: string): Promise<OrderEntity | null>;
  findMany(params: OrderRepositoryFindManyParams): Promise<{ data: OrderEntity[]; total: number }>;
}
