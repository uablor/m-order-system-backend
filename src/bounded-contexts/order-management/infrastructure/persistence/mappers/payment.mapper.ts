import type { PaymentAggregate } from '../../../domain/aggregates/payment.aggregate';
import { PaymentAggregate as PaymentAggregateClass } from '../../../domain/aggregates/payment.aggregate';
import type { PaymentOrmEntity } from '../entities/payment.orm-entity';

export function paymentOrmToDomain(orm: PaymentOrmEntity): PaymentAggregate {
  return PaymentAggregateClass.fromPersistence({
    id: orm.domain_id,
    merchantId: orm.technical_merchant_id,
    orderId: orm.technical_order_id,
    amount: Number(orm.payment_amount),
    currency: 'LAK',
    status: orm.status,
    paidAt: orm.payment_at ?? orm.payment_date,
    createdAt: orm.created_at,
    updatedAt: orm.created_at,
  });
}

export function paymentDomainToOrm(aggregate: PaymentAggregate): Partial<PaymentOrmEntity> {
  return {
    technical_id: aggregate.id,
    domain_id: aggregate.id,
    technical_order_id: aggregate.orderId,
    technical_merchant_id: aggregate.merchantId,
    technical_customer_id: '',
    payment_amount: aggregate.amount,
    payment_date: aggregate.paidAt,
    payment_at: aggregate.paidAt,
    status: aggregate.status,
  };
}
