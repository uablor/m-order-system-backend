import type { RoleEntity, PermissionEntity } from '../../../domain/entities';
import { RoleEntity as RoleEntityClass } from '../../../domain/entities/role.entity';
import type { RoleOrmEntity, PermissionOrmEntity } from '../entities';
import { permissionOrmToDomain } from './permission.mapper';

export function roleOrmToDomain(orm: RoleOrmEntity, permissions?: PermissionEntity[]): RoleEntity {
  return RoleEntityClass.create({
    id: orm.domain_id,
    roleName: orm.role_name,
    description: orm.description ?? undefined,
    permissions: permissions ?? (orm.permissions?.map(permissionOrmToDomain) ?? undefined),
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function roleDomainToOrm(entity: RoleEntity): Partial<RoleOrmEntity> {
  return {
    domain_id: entity.id,
    role_name: entity.roleName,
    description: entity.description ?? null,
    updated_at: entity.updatedAt ?? new Date(),
  };
}
