import type { CustomerOrderItemEntity } from '../../../domain/entities/customer-order-item.entity';
import { CustomerOrderItemEntity as CustomerOrderItemEntityClass } from '../../../domain/entities/customer-order-item.entity';
import type { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';

export function customerOrderItemOrmToDomain(
  orm: CustomerOrderItemOrmEntity,
): CustomerOrderItemEntity {
  return CustomerOrderItemEntityClass.create({
    id: orm.domain_id,
    customerOrderId: orm.technical_customer_order_id,
    productRef: '',
    quantity: Number(orm.quantity),
    unitPrice: Number(orm.selling_price_foreign),
    totalPrice: Number(orm.selling_total_lak),
    currency: 'LAK',
  });
}

export function customerOrderItemDomainToOrm(
  entity: CustomerOrderItemEntity,
  customerOrderTechnicalId: string,
): Partial<CustomerOrderItemOrmEntity> {
  return {
    technical_id: entity.id,
    domain_id: entity.id,
    technical_customer_order_id: customerOrderTechnicalId,
    technical_order_item_id: '',
    quantity: entity.quantity,
    selling_price_foreign: entity.unitPrice,
    selling_total_lak: entity.totalPrice,
    profit_lak: 0,
  };
}
