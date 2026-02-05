import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { OrderItemEntity } from '../../../domain/entities/order-item.entity';
import { OrderItemEntity as OrderItemClass } from '../../../domain/entities/order-item.entity';
import type { OrderItemOrmEntity } from '../entities/order-item.orm-entity';

function toNum(v: string | number): number {
  return typeof v === 'number' ? v : Number(v);
}

export function orderItemOrmToDomain(orm: OrderItemOrmEntity): OrderItemEntity {
  return OrderItemClass.create({
    id: UniqueEntityId.create(orm.item_id),
    orderId: orm.order_id,
    productName: orm.product_name,
    variant: orm.variant ?? '',
    quantity: orm.quantity,
    purchaseCurrency: orm.purchase_currency,
    purchasePrice: toNum(orm.purchase_price),
    purchaseExchangeRate: toNum(orm.purchase_exchange_rate),
    purchaseTotalLak: toNum(orm.purchase_total_lak),
    totalCostBeforeDiscountLak: toNum(orm.total_cost_before_discount_lak),
    discountType: (orm.discount_type ?? 'FIX') as 'PERCENT' | 'FIX',
    discountValue: toNum(orm.discount_value),
    discountAmountLak: toNum(orm.discount_amount_lak),
    finalCostLak: toNum(orm.final_cost_lak),
    finalCostThb: toNum(orm.final_cost_thb),
    sellingPriceForeign: toNum(orm.selling_price_foreign),
    sellingExchangeRate: toNum(orm.selling_exchange_rate),
    sellingTotalLak: toNum(orm.selling_total_lak),
    profitLak: toNum(orm.profit_lak),
    profitThb: toNum(orm.profit_thb),
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function orderItemDomainToOrm(
  item: OrderItemEntity,
  orderId: string,
): Partial<OrderItemOrmEntity> {
  const id = typeof item.id === 'string' ? item.id : item.id.value;
  return {
    item_id: id,
    order_id: orderId,
    product_name: item.productName,
    variant: item.variant,
    quantity: item.quantity,
    purchase_currency: item.purchaseCurrency,
    purchase_price: String(item.purchasePrice),
    purchase_exchange_rate: String(item.purchaseExchangeRate),
    purchase_total_lak: String(item.purchaseTotalLak),
    total_cost_before_discount_lak: String(item.totalCostBeforeDiscountLak),
    discount_type: item.discountType,
    discount_value: String(item.discountValue),
    discount_amount_lak: String(item.discountAmountLak),
    final_cost_lak: String(item.finalCostLak),
    final_cost_thb: String(item.finalCostThb),
    selling_price_foreign: String(item.sellingPriceForeign),
    selling_exchange_rate: String(item.sellingExchangeRate),
    selling_total_lak: String(item.sellingTotalLak),
    profit_lak: String(item.profitLak),
    profit_thb: String(item.profitThb),
    updated_at: item.updatedAt ?? new Date(),
  };
}
