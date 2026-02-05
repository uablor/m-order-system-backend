import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListArrivalsQuery } from './list-arrivals.query';
import { ARRIVAL_REPOSITORY, type IArrivalRepository } from '../../domain/repositories/arrival.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListArrivalsQuery)
export class ListArrivalsHandler implements IQueryHandler<ListArrivalsQuery> {
  constructor(
    @Inject(ARRIVAL_REPOSITORY)
    private readonly repo: IArrivalRepository,
  ) {}

  async execute(query: ListArrivalsQuery) {
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      orderId: query.orderId,
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
        arrivedDate: a.arrivedDate,
        arrivedTime: a.arrivedTime,
        recordedBy: a.recordedBy,
        status: a.status,
        createdAt: a.createdAt,
      })),
      pagination,
    };
  }
}
