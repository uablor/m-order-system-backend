import type { PaymentAggregate } from '../aggregates/payment.aggregate';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface IPaymentRepository {
  save(aggregate: PaymentAggregate): Promise<PaymentAggregate>;
  findById(id: string): Promise<PaymentAggregate | null>;
  findByOrderId(orderId: string): Promise<PaymentAggregate[]>;
}
