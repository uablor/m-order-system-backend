/**
 * Fixtures for Order aggregate and related domain objects.
 * Use for unit/integration tests only. No ORM or infrastructure.
 */
import { UniqueEntityId } from '../../../src/shared/domain/value-objects';
import { OrderAggregate } from '../../../src/bounded-contexts/order-management/domain/aggregates/order.aggregate';
import { OrderItemEntity } from '../../../src/bounded-contexts/order-management/domain/entities/order-item.entity';
import { generateUuid } from '../../../src/shared/utils';

export function createOrderId(): UniqueEntityId {
  return UniqueEntityId.create(generateUuid());
}

export function createOrderItemOverrides(overrides: Partial<{
  orderId: string;
  productName: string;
  quantity: number;
  purchasePrice: number;
  finalCostLak: number;
  sellingTotalLak: number;
}> = {}) {
  const orderId = overrides.orderId ?? generateUuid();
  return {
    id: createOrderId(),
    orderId,
    productName: overrides.productName ?? 'Product A',
    variant: 'Size M',
    quantity: overrides.quantity ?? 2,
    purchaseCurrency: 'THB',
    purchasePrice: overrides.purchasePrice ?? 100,
    purchaseExchangeRate: 350,
    purchaseTotalLak: (overrides.quantity ?? 2) * 350 * (overrides.purchasePrice ?? 100) / 100,
    totalCostBeforeDiscountLak: 70000,
    discountType: 'FIX' as const,
    discountValue: 0,
    discountAmountLak: 0,
    finalCostLak: overrides.finalCostLak ?? 70000,
    finalCostThb: 200,
    sellingPriceForeign: 150,
    sellingExchangeRate: 350,
    sellingTotalLak: overrides.sellingTotalLak ?? 105000,
    profitLak: 35000,
    profitThb: 100,
    ...overrides,
  };
}

export function createOrderAggregateOverrides(overrides: Partial<{
  merchantId: string;
  createdBy: string;
  orderCode: string;
  items: OrderItemEntity[];
}> = {}) {
  const merchantId = overrides.merchantId ?? generateUuid();
  const createdBy = overrides.createdBy ?? generateUuid();
  return {
    id: createOrderId(),
    merchantId,
    createdBy,
    orderCode: overrides.orderCode ?? `ORD-${Date.now()}`,
    orderDate: new Date(),
    arrivalStatus: 'NOT_ARRIVED' as const,
    totalPurchaseCostLak: 0,
    totalShippingCostLak: 0,
    totalCostBeforeDiscountLak: 0,
    totalDiscountLak: 0,
    totalFinalCostLak: 0,
    totalFinalCostThb: 0,
    totalSellingAmountLak: 0,
    totalSellingAmountThb: 0,
    totalProfitLak: 0,
    totalProfitThb: 0,
    depositAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    paymentStatus: 'UNPAID' as const,
    items: overrides.items ?? [],
    isClosed: false,
    ...overrides,
  };
}

export function createOrderAggregate(overrides = {}) {
  return OrderAggregate.create(createOrderAggregateOverrides(overrides));
}

export function createOrderItem(overrides = {}) {
  const o = createOrderItemOverrides(overrides);
  return OrderItemEntity.create({
    ...o,
    id: o.id,
  });
}
