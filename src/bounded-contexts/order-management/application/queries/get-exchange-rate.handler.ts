import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExchangeRateQuery } from './get-exchange-rate.query';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';

@QueryHandler(GetExchangeRateQuery)
export class GetExchangeRateHandler implements IQueryHandler<GetExchangeRateQuery> {
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(query: GetExchangeRateQuery) {
    const aggregate = await this.repo.findById(query.id);
    if (!aggregate) return null;
    return {
      id: aggregate.id.value,
      merchantId: aggregate.merchantId,
      baseCurrency: aggregate.baseCurrency,
      targetCurrency: aggregate.targetCurrency,
      rateType: aggregate.rateType,
      rate: aggregate.rate,
      isActive: aggregate.isActive,
      rateDate: aggregate.rateDate,
      createdBy: aggregate.createdBy,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
