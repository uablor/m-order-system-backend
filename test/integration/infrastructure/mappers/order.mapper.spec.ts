/**
 * Infrastructure: Order mapper ORM <-> Domain. No DB; pure conversion.
 */
import { UniqueEntityId } from '../../../../src/shared/domain/value-objects';
import { OrderAggregate } from '../../../../src/bounded-contexts/order-management/domain/aggregates/order.aggregate';
import { orderOrmToDomain, orderDomainToOrm } from '../../../../src/bounded-contexts/order-management/infrastructure/persistence/mappers/order.mapper';
import type { OrderOrmEntity } from '../../../../src/bounded-contexts/order-management/infrastructure/persistence/entities/order.orm-entity';
import { createOrderAggregate } from '../../../fixtures/domain/order.fixture';

describe('Order Mapper', () => {
  it('orderDomainToOrm maps aggregate to ORM shape', () => {
    const aggregate = createOrderAggregate({
      orderCode: 'ORD-MAP',
      totalFinalCostLak: 100000,
      paymentStatus: 'PAID',
    });
    const orm = orderDomainToOrm(aggregate);
    expect(orm.order_id).toBe(aggregate.id.value);
    expect(orm.order_code).toBe('ORD-MAP');
    expect(orm.merchant_id).toBe(aggregate.merchantId);
    expect(orm.payment_status).toBe('PAID');
    expect(Number(orm.total_final_cost_lak)).toBe(100000);
  });

  it('orderOrmToDomain maps ORM to aggregate', () => {
    const orm: OrderOrmEntity = {
      order_id: 'uuid-1',
      merchant_id: 'm1',
      created_by: 'u1',
      order_code: 'ORD-1',
      order_date: new Date(),
      arrival_status: 'NOT_ARRIVED',
      arrived_at: null,
      notified_at: null,
      total_purchase_cost_lak: '0',
      total_shipping_cost_lak: '0',
      total_cost_before_discount_lak: '0',
      total_discount_lak: '0',
      total_final_cost_lak: '50000',
      total_final_cost_thb: '100',
      total_selling_amount_lak: '60000',
      total_selling_amount_thb: '120',
      total_profit_lak: '10000',
      total_profit_thb: '20',
      deposit_amount: '0',
      paid_amount: '0',
      remaining_amount: '60000',
      payment_status: 'UNPAID',
      is_closed: false,
      created_at: new Date(),
      updated_at: new Date(),
      items: [],
    };
    const aggregate = orderOrmToDomain(orm);
    expect(aggregate.id.value).toBe('uuid-1');
    expect(aggregate.orderCode).toBe('ORD-1');
    expect(aggregate.totalFinalCostLak).toBe(50000);
    expect(aggregate.paymentStatus).toBe('UNPAID');
  });

  it('round-trip: domain -> orm -> domain preserves key fields', () => {
    const aggregate = createOrderAggregate({ orderCode: 'ORD-RT' });
    const orm = orderDomainToOrm(aggregate);
    const ormFull = { ...orm, created_at: aggregate.createdAt!, updated_at: aggregate.updatedAt!, items: [] } as OrderOrmEntity;
    const back = orderOrmToDomain(ormFull);
    expect(back.id.value).toBe(aggregate.id.value);
    expect(back.orderCode).toBe(aggregate.orderCode);
    expect(back.merchantId).toBe(aggregate.merchantId);
  });
});
