import type { ExchangeRateAggregate } from '../../../domain/aggregates/exchange-rate.aggregate';
import { ExchangeRateAggregate as ExchangeRateAggregateClass } from '../../../domain/aggregates/exchange-rate.aggregate';
import type { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';

export function exchangeRateOrmToDomain(orm: ExchangeRateOrmEntity): ExchangeRateAggregate {
  return ExchangeRateAggregateClass.fromPersistence({
    id: orm.domain_id,
    merchantId: orm.technical_merchant_id,
    baseCurrency: orm.base_currency,
    targetCurrency: orm.target_currency,
    rateType: orm.rate_type,
    rate: Number(orm.rate),
    rateDate: orm.rate_date,
    createdAt: orm.created_at,
    updatedAt: orm.created_at,
  });
}

export function exchangeRateDomainToOrm(
  aggregate: ExchangeRateAggregate,
): Partial<ExchangeRateOrmEntity> {
  return {
    technical_id: aggregate.id,
    domain_id: aggregate.id,
    technical_merchant_id: aggregate.merchantId,
    base_currency: aggregate.baseCurrency,
    target_currency: aggregate.targetCurrency,
    rate_type: aggregate.rateType,
    rate: aggregate.rate,
    rate_date: aggregate.rateDate,
    technical_user_id: '',
  };
}
