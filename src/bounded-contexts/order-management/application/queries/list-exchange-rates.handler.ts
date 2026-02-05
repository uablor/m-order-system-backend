import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListExchangeRatesQuery } from './list-exchange-rates.query';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListExchangeRatesQuery)
export class ListExchangeRatesHandler implements IQueryHandler<ListExchangeRatesQuery> {
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(query: ListExchangeRatesQuery) {
    const fromDate = query.fromDate ? new Date(query.fromDate) : undefined;
    const toDate = query.toDate ? new Date(query.toDate) : undefined;
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      page: query.page,
      limit: query.limit,
      fromDate,
      toDate,
    });
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);
    return {
      data: data.map((a) => ({
        id: a.id.value,
        merchantId: a.merchantId,
        baseCurrency: a.baseCurrency,
        targetCurrency: a.targetCurrency,
        rateType: a.rateType,
        rate: a.rate,
        isActive: a.isActive,
        rateDate: a.rateDate,
        createdBy: a.createdBy,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      pagination,
    };
  }
}
