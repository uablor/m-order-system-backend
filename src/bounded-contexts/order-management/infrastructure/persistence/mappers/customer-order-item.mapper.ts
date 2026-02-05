import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { CustomerOrderItemEntity } from '../../../domain/entities/customer-order-item.entity';
import { CustomerOrderItemEntity as CustomerOrderItemClass } from '../../../domain/entities/customer-order-item.entity';
import type { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';

function toNum(v: string | number): number {
  return typeof v === 'number' ? v : Number(v);
}

export function customerOrderItemOrmToDomain(
  orm: CustomerOrderItemOrmEntity,
): CustomerOrderItemEntity {
  return CustomerOrderItemClass.create({
    id: UniqueEntityId.create(orm.id),
    customerOrderId: orm.customer_order_id,
    orderItemId: orm.order_item_id,
    quantity: orm.quantity,
    sellingPriceForeign: toNum(orm.selling_price_foreign),
    sellingTotalLak: toNum(orm.selling_total_lak),
    profitLak: toNum(orm.profit_lak),
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function customerOrderItemDomainToOrm(
  item: CustomerOrderItemEntity,
  customerOrderId: string,
): Partial<CustomerOrderItemOrmEntity> {
  const id = typeof item.id === 'string' ? item.id : item.id.value;
  return {
    id,
    customer_order_id: customerOrderId,
    order_item_id: item.orderItemId,
    quantity: item.quantity,
    selling_price_foreign: String(item.sellingPriceForeign),
    selling_total_lak: String(item.sellingTotalLak),
    profit_lak: String(item.profitLak),
    updated_at: item.updatedAt ?? new Date(),
  };
}
