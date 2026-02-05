import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { OrderAggregate } from '../../../domain/aggregates/order.aggregate';
import { OrderAggregate as OrderClass } from '../../../domain/aggregates/order.aggregate';
import type { OrderOrmEntity } from '../entities/order.orm-entity';
import { orderItemOrmToDomain } from './order-item.mapper';

function toNum(v: string | number): number {
  return typeof v === 'number' ? v : Number(v);
}

export function orderOrmToDomain(orm: OrderOrmEntity): OrderAggregate {
  const items = (orm.items ?? []).map(orderItemOrmToDomain);
  return OrderClass.fromPersistence({
    id: UniqueEntityId.create(orm.order_id),
    merchantId: orm.merchant_id,
    createdBy: orm.created_by,
    orderCode: orm.order_code,
    orderDate: orm.order_date instanceof Date ? orm.order_date : new Date(orm.order_date),
    arrivalStatus: (orm.arrival_status ?? 'NOT_ARRIVED') as 'NOT_ARRIVED' | 'ARRIVED',
    arrivedAt: orm.arrived_at ?? undefined,
    notifiedAt: orm.notified_at ?? undefined,
    totalPurchaseCostLak: toNum(orm.total_purchase_cost_lak),
    totalShippingCostLak: toNum(orm.total_shipping_cost_lak),
    totalCostBeforeDiscountLak: toNum(orm.total_cost_before_discount_lak),
    totalDiscountLak: toNum(orm.total_discount_lak),
    totalFinalCostLak: toNum(orm.total_final_cost_lak),
    totalFinalCostThb: toNum(orm.total_final_cost_thb),
    totalSellingAmountLak: toNum(orm.total_selling_amount_lak),
    totalSellingAmountThb: toNum(orm.total_selling_amount_thb),
    totalProfitLak: toNum(orm.total_profit_lak),
    totalProfitThb: toNum(orm.total_profit_thb),
    depositAmount: toNum(orm.deposit_amount),
    paidAmount: toNum(orm.paid_amount),
    remainingAmount: toNum(orm.remaining_amount),
    paymentStatus: (orm.payment_status ?? 'UNPAID') as 'UNPAID' | 'PARTIAL' | 'PAID',
    items,
    isClosed: orm.is_closed ?? false,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function orderDomainToOrm(agg: OrderAggregate): Partial<OrderOrmEntity> {
  const id = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    order_id: id,
    merchant_id: agg.merchantId,
    created_by: agg.createdBy,
    order_code: agg.orderCode,
    order_date: agg.orderDate,
    arrival_status: agg.arrivalStatus,
    arrived_at: agg.arrivedAt ?? null,
    notified_at: agg.notifiedAt ?? null,
    total_purchase_cost_lak: String(agg.totalPurchaseCostLak),
    total_shipping_cost_lak: String(agg.totalShippingCostLak),
    total_cost_before_discount_lak: String(agg.totalCostBeforeDiscountLak),
    total_discount_lak: String(agg.totalDiscountLak),
    total_final_cost_lak: String(agg.totalFinalCostLak),
    total_final_cost_thb: String(agg.totalFinalCostThb),
    total_selling_amount_lak: String(agg.totalSellingAmountLak),
    total_selling_amount_thb: String(agg.totalSellingAmountThb),
    total_profit_lak: String(agg.totalProfitLak),
    total_profit_thb: String(agg.totalProfitThb),
    deposit_amount: String(agg.depositAmount),
    paid_amount: String(agg.paidAmount),
    remaining_amount: String(agg.remainingAmount),
    payment_status: agg.paymentStatus,
    is_closed: agg.isClosed,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
