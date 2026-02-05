import type { PaymentAggregate } from '../aggregates/payment.aggregate';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepositoryFindManyParams {
  merchantId: string;
  orderId?: string;
  customerId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface IPaymentRepository {
  save(aggregate: PaymentAggregate): Promise<PaymentAggregate>;
  findById(id: string): Promise<PaymentAggregate | null>;
  findMany(params: PaymentRepositoryFindManyParams): Promise<{
    data: PaymentAggregate[];
    total: number;
  }>;
}
