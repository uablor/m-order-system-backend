/**
 * Application: GetOrderHandler. Mock only repository.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { GetOrderQuery } from '../../../../src/bounded-contexts/order-management/application/queries/get-order.query';
import { GetOrderHandler } from '../../../../src/bounded-contexts/order-management/application/queries/get-order.handler';
import { ORDER_REPOSITORY } from '../../../../src/bounded-contexts/order-management/domain/repositories/order.repository';
import { createMockOrderRepository } from '../../../mocks/repositories/order-repository.mock';
import { createOrderAggregate } from '../../../fixtures/domain/order.fixture';

describe('GetOrderHandler', () => {
  let handler: GetOrderHandler;
  let repo: ReturnType<typeof createMockOrderRepository>;

  beforeEach(async () => {
    repo = createMockOrderRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrderHandler,
        { provide: ORDER_REPOSITORY, useValue: repo },
      ],
    }).compile();
    handler = module.get(GetOrderHandler);
  });

  it('returns null when order not found', async () => {
    repo.findById.mockResolvedValue(null);
    const query = new GetOrderQuery('non-existent-id', 'merchant-id');
    const result = await handler.execute(query);
    expect(result).toBeNull();
    expect(repo.findById).toHaveBeenCalledWith('non-existent-id', 'merchant-id');
  });

  it('returns DTO when order found', async () => {
    const aggregate = createOrderAggregate({ orderCode: 'ORD-1' });
    repo.findById.mockResolvedValue(aggregate);
    const query = new GetOrderQuery(aggregate.id.value, aggregate.merchantId);
    const result = await handler.execute(query);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(aggregate.id.value);
    expect(result?.orderCode).toBe('ORD-1');
    expect(result?.merchantId).toBe(aggregate.merchantId);
    expect(result?.paymentStatus).toBe(aggregate.paymentStatus);
  });
});
