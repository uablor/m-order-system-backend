import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { CustomerOrderAggregate } from '../../../domain/aggregates/customer-order.aggregate';
import { CustomerOrderAggregate as CustomerOrderClass } from '../../../domain/aggregates/customer-order.aggregate';
import type { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { customerOrderItemOrmToDomain } from './customer-order-item.mapper';

function toNum(v: string | number): number {
  return typeof v === 'number' ? v : Number(v);
}

export function customerOrderOrmToDomain(orm: CustomerOrderOrmEntity): CustomerOrderAggregate {
  const items = (orm.items ?? []).map(customerOrderItemOrmToDomain);
  return CustomerOrderClass.fromPersistence({
    id: UniqueEntityId.create(orm.customer_order_id),
    orderId: orm.order_id,
    customerId: orm.customer_id,
    merchantId: orm.merchant_id,
    totalSellingAmountLak: toNum(orm.total_selling_amount_lak),
    totalPaid: toNum(orm.total_paid),
    remainingAmount: toNum(orm.remaining_amount),
    paymentStatus: (orm.payment_status ?? 'UNPAID') as 'UNPAID' | 'PARTIAL' | 'PAID',
    items,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function customerOrderDomainToOrm(
  agg: CustomerOrderAggregate,
): Partial<CustomerOrderOrmEntity> {
  const id = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    customer_order_id: id,
    order_id: agg.orderId,
    customer_id: agg.customerId,
    merchant_id: agg.merchantId,
    total_selling_amount_lak: String(agg.totalSellingAmountLak),
    total_paid: String(agg.totalPaid),
    remaining_amount: String(agg.remainingAmount),
    payment_status: agg.paymentStatus,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
