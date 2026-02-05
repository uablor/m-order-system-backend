import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { RoleAggregate } from '../../../domain/aggregates/role.aggregate';
import { RoleAggregate as RoleClass } from '../../../domain/aggregates/role.aggregate';
import type { RoleOrmEntity } from '../entities/role.orm-entity';

export function roleOrmToDomain(orm: RoleOrmEntity, permissionIds: string[]): RoleAggregate {
  return RoleClass.fromPersistence({
    id: UniqueEntityId.create(orm.id),
    name: orm.name,
    merchantId: orm.merchant_id,
    permissionIds,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function roleDomainToOrm(agg: RoleAggregate): Partial<RoleOrmEntity> {
  const id = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    id,
    name: agg.name,
    merchant_id: agg.merchantId,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
