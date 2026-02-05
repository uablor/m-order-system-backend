import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { PaymentAggregate } from '../../../domain/aggregates/payment.aggregate';
import { PaymentAggregate as PaymentClass } from '../../../domain/aggregates/payment.aggregate';
import type { PaymentOrmEntity } from '../entities/payment.orm-entity';

function toNum(v: string | number): number {
  return typeof v === 'number' ? v : Number(v);
}

export function paymentOrmToDomain(orm: PaymentOrmEntity): PaymentAggregate {
  return PaymentClass.fromPersistence({
    id: UniqueEntityId.create(orm.payment_id),
    orderId: orm.order_id,
    merchantId: orm.merchant_id,
    customerId: orm.customer_id,
    paymentAmount: toNum(orm.payment_amount),
    paymentDate: orm.payment_date instanceof Date ? orm.payment_date : new Date(orm.payment_date),
    paymentMethod: orm.payment_method,
    paymentProofUrl: orm.payment_proof_url ?? undefined,
    paymentAt: orm.payment_at ?? undefined,
    customerMessage: orm.customer_message ?? undefined,
    status: (orm.status ?? 'PENDING') as 'PENDING' | 'VERIFIED' | 'REJECTED',
    verifiedBy: orm.verified_by ?? undefined,
    verifiedAt: orm.verified_at ?? undefined,
    rejectedBy: orm.rejected_by ?? undefined,
    rejectedAt: orm.rejected_at ?? undefined,
    rejectReason: orm.reject_reason ?? undefined,
    notes: orm.notes ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.created_at,
  });
}

export function paymentDomainToOrm(agg: PaymentAggregate): Partial<PaymentOrmEntity> {
  const id = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    payment_id: id,
    order_id: agg.orderId,
    merchant_id: agg.merchantId,
    customer_id: agg.customerId,
    payment_amount: String(agg.paymentAmount),
    payment_date: agg.paymentDate,
    payment_method: agg.paymentMethod,
    payment_proof_url: agg.paymentProofUrl ?? null,
    payment_at: agg.paymentAt ?? null,
    customer_message: agg.customerMessage ?? null,
    status: agg.status,
    verified_by: agg.verifiedBy ?? null,
    verified_at: agg.verifiedAt ?? null,
    rejected_by: agg.rejectedBy ?? null,
    rejected_at: agg.rejectedAt ?? null,
    reject_reason: agg.rejectReason ?? null,
    notes: agg.notes ?? null,
  };
}
