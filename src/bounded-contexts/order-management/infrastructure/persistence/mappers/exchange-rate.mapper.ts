import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { ExchangeRateAggregate } from '../../../domain/aggregates/exchange-rate.aggregate';
import { ExchangeRateAggregate as ExchangeRateClass } from '../../../domain/aggregates/exchange-rate.aggregate';
import type { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';

export function exchangeRateOrmToDomain(orm: ExchangeRateOrmEntity): ExchangeRateAggregate {
  return ExchangeRateClass.fromPersistence({
    id: UniqueEntityId.create(orm.rate_id),
    merchantId: orm.merchant_id,
    baseCurrency: orm.base_currency,
    targetCurrency: orm.target_currency,
    rateType: orm.rate_type as 'BUY' | 'SELL',
    rate: Number(orm.rate),
    isActive: orm.is_active,
    rateDate: orm.rate_date instanceof Date ? orm.rate_date : new Date(orm.rate_date),
    createdBy: orm.created_by,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at ?? orm.created_at,
  });
}

export function exchangeRateDomainToOrm(
  agg: ExchangeRateAggregate,
): Partial<ExchangeRateOrmEntity> {
  const id = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    rate_id: id,
    merchant_id: agg.merchantId,
    base_currency: agg.baseCurrency,
    target_currency: agg.targetCurrency,
    rate_type: agg.rateType,
    rate: String(agg.rate),
    is_active: agg.isActive,
    rate_date: agg.rateDate,
    created_by: agg.createdBy,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
