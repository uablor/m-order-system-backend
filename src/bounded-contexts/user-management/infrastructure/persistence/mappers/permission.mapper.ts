import type { PermissionEntity } from '../../../domain/entities';
import { PermissionEntity as PermissionEntityClass } from '../../../domain/entities/permission.entity';
import type { PermissionOrmEntity } from '../entities';

export function permissionOrmToDomain(orm: PermissionOrmEntity): PermissionEntity {
  return PermissionEntityClass.create({
    id: orm.domain_id,
    permissionCode: orm.permission_code,
    description: orm.description ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function permissionDomainToOrm(entity: PermissionEntity): Partial<PermissionOrmEntity> {
  return {
    domain_id: entity.id,
    permission_code: entity.permissionCode,
    description: entity.description ?? null,
    updated_at: entity.updatedAt ?? new Date(),
  };
}
