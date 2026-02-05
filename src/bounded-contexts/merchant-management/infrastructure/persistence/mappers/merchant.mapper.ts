import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { MerchantAggregate } from '../../../domain/aggregates/merchant.aggregate';
import { MerchantAggregate as MerchantClass } from '../../../domain/aggregates/merchant.aggregate';
import type { MerchantOrmEntity } from '../entities/merchant.orm-entity';

export function merchantOrmToDomain(orm: MerchantOrmEntity): MerchantAggregate {
  return MerchantClass.fromPersistence({
    id: UniqueEntityId.create(orm.domain_id ?? orm.id),
    shopName: orm.shop_name,
    defaultCurrency: orm.default_currency,
    isActive: orm.is_active,
    ownerUserId: orm.owner_user_id ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function merchantDomainToOrm(agg: MerchantAggregate): Partial<MerchantOrmEntity> {
  const domainId = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    id: domainId,
    domain_id: domainId,
    shop_name: agg.shopName,
    default_currency: agg.defaultCurrency,
    is_active: agg.isActive,
    owner_user_id: agg.ownerUserId ?? null,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
