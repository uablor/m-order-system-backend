import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { PermissionAggregate } from '../../../domain/aggregates/permission.aggregate';
import { PermissionAggregate as PermissionClass } from '../../../domain/aggregates/permission.aggregate';
import type { PermissionOrmEntity } from '../entities/permission.orm-entity';

export function permissionOrmToDomain(orm: PermissionOrmEntity): PermissionAggregate {
  return PermissionClass.fromPersistence({
    id: UniqueEntityId.create(orm.domain_id ?? orm.id),
    code: orm.code,
    name: orm.name,
    description: orm.description ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function permissionDomainToOrm(agg: PermissionAggregate): Partial<PermissionOrmEntity> {
  const domainId = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    id: domainId,
    domain_id: domainId,
    code: agg.code,
    name: agg.name,
    description: agg.description ?? null,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
