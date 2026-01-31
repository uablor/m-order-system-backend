import { CustomerOrderAggregate } from '../../../domain/aggregates/customer-order.aggregate';
import { CustomerOrderItemEntity } from '../../../domain/entities/customer-order-item.entity';
import type { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import type { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';

export function customerOrderOrmToDomain(
  orm: CustomerOrderOrmEntity,
  itemOrms?: CustomerOrderItemOrmEntity[],
): CustomerOrderAggregate {
  const items =
    itemOrms?.map((i) =>
      CustomerOrderItemEntity.create({
        id: i.domain_id,
        customerOrderId: i.customer_order_id,
        productRef: i.product_ref,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unit_price),
        totalPrice: Number(i.total_price),
        currency: i.currency,
        createdAt: i.created_at,
        updatedAt: i.updated_at,
      }),
    ) ?? [];
  return CustomerOrderAggregate.fromPersistence({
    id: orm.domain_id,
    merchantId: orm.merchant_id,
    customerId: orm.customer_id,
    orderId: orm.order_id ?? undefined,
    orderCode: orm.order_code,
    orderDate: orm.order_date,
    status: orm.status,
    totalAmount: Number(orm.total_amount),
    currency: orm.currency,
    paymentStatus: orm.payment_status,
    items,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
    // items,
  });
}

export function customerOrderDomainToOrm(
  aggregate: CustomerOrderAggregate,
): Partial<CustomerOrderOrmEntity> {
  return {
    domain_id: aggregate.id,
    merchant_id: aggregate.merchantId,
    customer_id: aggregate.customerId,
    order_id: aggregate.orderId ?? null,
    order_code: aggregate.orderCode,
    order_date: aggregate.orderDate,
    status: aggregate.status,
    total_amount: aggregate.totalAmount,
    currency: aggregate.currency,
    payment_status: aggregate.paymentStatus,
    updated_at: aggregate.updatedAt ?? new Date(),
  };
}
