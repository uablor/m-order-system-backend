import type { ExchangeRateAggregate } from '../aggregates/exchange-rate.aggregate';

export const EXCHANGE_RATE_REPOSITORY = Symbol('EXCHANGE_RATE_REPOSITORY');

export interface ExchangeRateRepositoryFindManyParams {
  merchantId: string;
  page?: number;
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
}

export interface IExchangeRateRepository {
  save(aggregate: ExchangeRateAggregate): Promise<ExchangeRateAggregate>;
  findById(id: string): Promise<ExchangeRateAggregate | null>;
  findByMerchantDateCurrencyType(
    merchantId: string,
    rateDate: Date,
    baseCurrency: string,
    targetCurrency: string,
    rateType: string,
  ): Promise<ExchangeRateAggregate | null>;
  findMany(params: ExchangeRateRepositoryFindManyParams): Promise<{
    data: ExchangeRateAggregate[];
    total: number;
  }>;
  delete(id: string): Promise<void>;
}
