import type { ExchangeRateAggregate } from '../aggregates/exchange-rate.aggregate';

export const EXCHANGE_RATE_REPOSITORY = Symbol('EXCHANGE_RATE_REPOSITORY');

export interface ExchangeRateRepositoryFindManyParams {
  merchantId: string;
  rateDate?: Date;
  rateType?: 'BUY' | 'SELL';
  baseCurrency?: string;
  page?: number;
  limit?: number;
}

export interface IExchangeRateRepository {
  save(aggregate: ExchangeRateAggregate): Promise<ExchangeRateAggregate>;
  findById(id: string): Promise<ExchangeRateAggregate | null>;
  findByDate(
    merchantId: string,
    rateDate: Date,
    rateType: 'BUY' | 'SELL',
    baseCurrency: string,
  ): Promise<ExchangeRateAggregate | null>;
  findMany(params: ExchangeRateRepositoryFindManyParams): Promise<{
    data: ExchangeRateAggregate[];
    total: number;
  }>;
}
