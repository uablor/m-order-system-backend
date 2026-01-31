import type { PermissionEntity } from '../../../domain/entities/permission.entity';
import { PermissionEntity as PermissionEntityClass } from '../../../domain/entities/permission.entity';
import type { PermissionOrmEntity } from '../entities/permission.orm-entity';

export function permissionOrmToDomain(orm: PermissionOrmEntity): PermissionEntity {
  return PermissionEntityClass.create({
    id: orm.domain_id,
    permissionCode: orm.permission_code,
    description: orm.description ?? undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });
}

export function permissionDomainToOrm(entity: PermissionEntity): Partial<PermissionOrmEntity> {
  return {
    technical_id: entity.id,
    domain_id: entity.id,
    permission_code: entity.permissionCode,
    description: entity.description ?? null,
  };
}
