/**
 * Application: CreateOrderHandler. Mock only repository (infrastructure).
 */
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderCommand } from '../../../../src/bounded-contexts/order-management/application/commands/create-order.command';
import { CreateOrderHandler } from '../../../../src/bounded-contexts/order-management/application/commands/create-order.handler';
import { ORDER_REPOSITORY } from '../../../../src/bounded-contexts/order-management/domain/repositories/order.repository';
import { createMockOrderRepository } from '../../../mocks/repositories/order-repository.mock';
import { createOrderAggregate } from '../../../fixtures/domain/order.fixture';

describe('CreateOrderHandler', () => {
  let handler: CreateOrderHandler;
  let repo: ReturnType<typeof createMockOrderRepository>;

  beforeEach(async () => {
    repo = createMockOrderRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderHandler,
        { provide: ORDER_REPOSITORY, useValue: repo },
      ],
    }).compile();
    handler = module.get(CreateOrderHandler);
  });

  it('throws ConflictException when orderCode exists for merchant', async () => {
    const existing = createOrderAggregate({ orderCode: 'ORD-1' });
    repo.findByOrderCode.mockResolvedValue(existing);
    const cmd = new CreateOrderCommand(
      existing.merchantId,
      existing.createdBy,
      'ORD-1',
      new Date().toISOString().slice(0, 10),
    );
    await expect(handler.execute(cmd)).rejects.toThrow(ConflictException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('creates and saves order when orderCode is unique', async () => {
    repo.findByOrderCode.mockResolvedValue(null);
    const saved = createOrderAggregate({ orderCode: 'ORD-NEW' });
    repo.save.mockResolvedValue(saved);
    const cmd = new CreateOrderCommand(
      saved.merchantId,
      saved.createdBy,
      'ORD-NEW',
      new Date().toISOString().slice(0, 10),
    );
    const result = await handler.execute(cmd);
    expect(result).toBe(saved);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.findByOrderCode).toHaveBeenCalledWith('ORD-NEW', saved.merchantId);
  });
});
