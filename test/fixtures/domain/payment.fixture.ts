/**
 * Fixtures for Payment aggregate. Master/domain only.
 */
import { UniqueEntityId } from '../../../src/shared/domain/value-objects';
import { PaymentAggregate } from '../../../src/bounded-contexts/order-management/domain/aggregates/payment.aggregate';
import { generateUuid } from '../../../src/shared/utils';

export function createPaymentId(): UniqueEntityId {
  return UniqueEntityId.create(generateUuid());
}

export function createPaymentAggregateOverrides(overrides: Partial<{
  orderId: string;
  merchantId: string;
  customerId: string;
  paymentAmount: number;
  paymentMethod: string;
}> = {}) {
  return {
    id: createPaymentId(),
    orderId: overrides.orderId ?? generateUuid(),
    merchantId: overrides.merchantId ?? generateUuid(),
    customerId: overrides.customerId ?? generateUuid(),
    paymentAmount: overrides.paymentAmount ?? 100000,
    paymentDate: new Date(),
    paymentMethod: overrides.paymentMethod ?? 'BANK_TRANSFER',
    status: 'PENDING' as const,
    ...overrides,
  };
}

export function createPaymentAggregate(overrides = {}) {
  return PaymentAggregate.create(createPaymentAggregateOverrides(overrides));
}
