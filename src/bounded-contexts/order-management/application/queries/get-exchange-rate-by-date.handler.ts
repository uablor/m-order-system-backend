import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExchangeRateByDateQuery } from './get-exchange-rate-by-date.query';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';

@QueryHandler(GetExchangeRateByDateQuery)
export class GetExchangeRateByDateHandler
  implements IQueryHandler<GetExchangeRateByDateQuery>
{
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(query: GetExchangeRateByDateQuery) {
    return this.repo.findByDate(
      query.merchantId,
      query.rateDate,
      query.rateType,
      query.baseCurrency,
    );
  }
}
