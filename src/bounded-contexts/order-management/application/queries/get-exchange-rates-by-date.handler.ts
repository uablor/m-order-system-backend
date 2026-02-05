import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExchangeRatesByDateQuery } from './get-exchange-rates-by-date.query';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';

@QueryHandler(GetExchangeRatesByDateQuery)
export class GetExchangeRatesByDateHandler implements IQueryHandler<GetExchangeRatesByDateQuery> {
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(query: GetExchangeRatesByDateQuery) {
    const { data } = await this.repo.findMany({
      merchantId: query.merchantId,
      fromDate: new Date(query.rateDate),
      toDate: new Date(query.rateDate),
      limit: 500,
    });
    return data.map((a) => ({
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
    }));
  }
}
