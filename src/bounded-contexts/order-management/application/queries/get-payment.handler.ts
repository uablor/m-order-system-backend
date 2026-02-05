import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPaymentQuery } from './get-payment.query';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain/repositories/payment.repository';

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repo: IPaymentRepository,
  ) {}

  async execute(query: GetPaymentQuery) {
    const aggregate = await this.repo.findById(query.id);
    if (!aggregate) return null;
    return {
      id: aggregate.id.value,
      orderId: aggregate.orderId,
      merchantId: aggregate.merchantId,
      customerId: aggregate.customerId,
      paymentAmount: aggregate.paymentAmount,
      paymentDate: aggregate.paymentDate,
      paymentMethod: aggregate.paymentMethod,
      paymentProofUrl: aggregate.paymentProofUrl,
      paymentAt: aggregate.paymentAt,
      customerMessage: aggregate.customerMessage,
      status: aggregate.status,
      verifiedBy: aggregate.verifiedBy,
      verifiedAt: aggregate.verifiedAt,
      rejectedBy: aggregate.rejectedBy,
      rejectedAt: aggregate.rejectedAt,
      rejectReason: aggregate.rejectReason,
      notes: aggregate.notes,
      createdAt: aggregate.createdAt,
    };
  }
}
