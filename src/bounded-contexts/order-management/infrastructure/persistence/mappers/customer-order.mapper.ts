import type { CustomerOrderAggregate } from '../../../domain/aggregates/customer-order.aggregate';
import { CustomerOrderAggregate as CustomerOrderAggregateClass } from '../../../domain/aggregates/customer-order.aggregate';
import type { CustomerOrderItemEntity } from '../../../domain/entities/customer-order-item.entity';
import type { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import type { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';
import { customerOrderItemOrmToDomain } from './customer-order-item.mapper';

export function customerOrderOrmToDomain(
  orm: CustomerOrderOrmEntity,
  items: CustomerOrderItemOrmEntity[],
): CustomerOrderAggregate {
  return CustomerOrderAggregateClass.fromPersistence({
    id: orm.domain_id,
    merchantId: '',
    customerId: orm.technical_customer_id,
    orderId: orm.technical_order_id,
    orderCode: '',
    orderDate: orm.created_at,
    status: '',
    totalAmount: Number(orm.total_selling_amount_lak),
    currency: 'LAK',
    paymentStatus: orm.payment_status,
    items: items.map((i) => customerOrderItemOrmToDomain(i)),
    createdAt: orm.created_at,
    updatedAt: orm.created_at,
  });
}

export function customerOrderDomainToOrm(
  aggregate: CustomerOrderAggregate,
): Partial<CustomerOrderOrmEntity> {
  return {
    technical_id: aggregate.id,
    domain_id: aggregate.id,
    technical_order_id: aggregate.orderId ?? '',
    technical_customer_id: aggregate.customerId,
    total_selling_amount_lak: aggregate.totalAmount,
    total_paid: 0,
    remaining_amount: aggregate.totalAmount,
    payment_status: aggregate.paymentStatus,
  };
}
