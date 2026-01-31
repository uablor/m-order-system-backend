import { ExchangeRateAggregate } from '../../../domain/aggregates/exchange-rate.aggregate';
import type { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';

export function exchangeRateOrmToDomain(orm: ExchangeRateOrmEntity): ExchangeRateAggregate {
  const rateDate = orm.rate_date instanceof Date ? orm.rate_date : new Date(orm.rate_date);
  return ExchangeRateAggregate.fromPersistence({
    id: orm.domain_id,
    merchantId: orm.merchant_id,
    baseCurrency: orm.base_currency,
    targetCurrency: orm.target_currency,
    rateType: orm.rate_type,
    rate: Number(orm.rate),
    rateDate,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function exchangeRateDomainToOrm(
  aggregate: ExchangeRateAggregate,
): Partial<ExchangeRateOrmEntity> {
  return {
    domain_id: aggregate.id,
    merchant_id: aggregate.merchantId,
    base_currency: aggregate.baseCurrency,
    target_currency: aggregate.targetCurrency,
    rate_type: aggregate.rateType,
    rate: aggregate.rate,
    rate_date: aggregate.rateDate,
    updated_at: aggregate.updatedAt ?? new Date(),
  };
}
