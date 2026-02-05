import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPaymentsQuery } from './list-payments.query';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain/repositories/payment.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListPaymentsQuery)
export class ListPaymentsHandler implements IQueryHandler<ListPaymentsQuery> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repo: IPaymentRepository,
  ) {}

  async execute(query: ListPaymentsQuery) {
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      orderId: query.orderId,
      customerId: query.customerId,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);
    return {
      data: data.map((a) => ({
        id: a.id.value,
        orderId: a.orderId,
        merchantId: a.merchantId,
        customerId: a.customerId,
        paymentAmount: a.paymentAmount,
        paymentDate: a.paymentDate,
        paymentMethod: a.paymentMethod,
        status: a.status,
        verifiedAt: a.verifiedAt,
        rejectedAt: a.rejectedAt,
        createdAt: a.createdAt,
      })),
      pagination,
    };
  }
}
