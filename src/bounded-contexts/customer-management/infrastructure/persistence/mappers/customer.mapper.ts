import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { CustomerAggregate } from '../../../domain/aggregates/customer.aggregate';
import { CustomerAggregate as CustomerClass } from '../../../domain/aggregates/customer.aggregate';
import type { CustomerOrmEntity } from '../entities/customer.orm-entity';

export function customerOrmToDomain(orm: CustomerOrmEntity): CustomerAggregate {
  return CustomerClass.fromPersistence({
    id: UniqueEntityId.create(orm.id),
    merchantId: orm.merchant_id,
    token: orm.token,
    fullName: orm.full_name,
    contactPhone: orm.contact_phone ?? undefined,
    contactEmail: orm.contact_email ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function customerDomainToOrm(agg: CustomerAggregate): Partial<CustomerOrmEntity> {
  const id = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    id,
    merchant_id: agg.merchantId,
    token: agg.token,
    full_name: agg.fullName,
    contact_phone: agg.contactPhone ?? null,
    contact_email: agg.contactEmail ?? null,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
