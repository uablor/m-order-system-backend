import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListExchangeRatesQuery } from './list-exchange-rates.query';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';

@QueryHandler(ListExchangeRatesQuery)
export class ListExchangeRatesHandler
  implements IQueryHandler<ListExchangeRatesQuery>
{
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(query: ListExchangeRatesQuery) {
    return this.repo.findMany({
      merchantId: query.merchantId,
      rateDate: query.rateDate,
      rateType: query.rateType,
      baseCurrency: query.baseCurrency,
      page: query.page,
      limit: query.limit,
    });
  }
}
