import { PaymentAggregate } from '../../../domain/aggregates/payment.aggregate';
import type { PaymentOrmEntity } from '../entities/payment.orm-entity';

export function paymentOrmToDomain(orm: PaymentOrmEntity): PaymentAggregate {
  return PaymentAggregate.fromPersistence({
    id: orm.domain_id,
    merchantId: orm.merchant_id,
    orderId: orm.order_id,
    amount: Number(orm.amount),
    currency: orm.currency,
    status: orm.status,
    paidAt: orm.paid_at,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function paymentDomainToOrm(
  aggregate: PaymentAggregate,
): Partial<PaymentOrmEntity> {
  return {
    domain_id: aggregate.id,
    merchant_id: aggregate.merchantId,
    order_id: aggregate.orderId,
    amount: aggregate.amount,
    currency: aggregate.currency,
    status: aggregate.status,
    paid_at: aggregate.paidAt,
    updated_at: aggregate.updatedAt ?? new Date(),
  };
}
