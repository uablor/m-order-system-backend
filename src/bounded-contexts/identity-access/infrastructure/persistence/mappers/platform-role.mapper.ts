import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { PlatformRoleAggregate } from '../../../domain/aggregates/platform-role.aggregate';
import { PlatformRoleAggregate as PlatformRoleClass } from '../../../domain/aggregates/platform-role.aggregate';
import type { PlatformRoleOrmEntity } from '../entities/platform-role.orm-entity';

export function platformRoleOrmToDomain(orm: PlatformRoleOrmEntity): PlatformRoleAggregate {
  return PlatformRoleClass.fromPersistence({
    id: UniqueEntityId.create(orm.domain_id ?? orm.id),
    name: orm.name,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function platformRoleDomainToOrm(
  agg: PlatformRoleAggregate,
): Partial<PlatformRoleOrmEntity> {
  const domainId = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    id: domainId,
    domain_id: domainId,
    name: agg.name,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
