/**
 * Mock Order Repository for application layer tests.
 * Mock only infrastructure (repository); never mock domain logic.
 */
import type { IOrderRepository, OrderRepositoryFindManyParams } from '../../../src/bounded-contexts/order-management/domain/repositories/order.repository';
import type { OrderAggregate } from '../../../src/bounded-contexts/order-management/domain/aggregates/order.aggregate';

export function createMockOrderRepository(overrides: Partial<{
  save: jest.Mock<Promise<OrderAggregate>, [OrderAggregate]>;
  findById: jest.Mock<Promise<OrderAggregate | null>, [string, string?]>;
  findByOrderCode: jest.Mock<Promise<OrderAggregate | null>, [string, string]>;
  findMany: jest.Mock<Promise<{ data: OrderAggregate[]; total: number }>, [OrderRepositoryFindManyParams]>;
  delete: jest.Mock<Promise<void>, [string]>;
}> = {}): jest.Mocked<IOrderRepository> {
  return {
    save: overrides.save ?? jest.fn(),
    findById: overrides.findById ?? jest.fn().mockResolvedValue(null),
    findByOrderCode: overrides.findByOrderCode ?? jest.fn().mockResolvedValue(null),
    findMany: overrides.findMany ?? jest.fn().mockResolvedValue({ data: [], total: 0 }),
    delete: overrides.delete ?? jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}
