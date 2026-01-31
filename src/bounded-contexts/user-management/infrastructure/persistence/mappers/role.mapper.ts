import type { RoleEntity } from '../../../domain/entities/role.entity';
import { RoleEntity as RoleEntityClass } from '../../../domain/entities/role.entity';
import type { RoleOrmEntity } from '../entities/role.orm-entity';
import type { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { permissionOrmToDomain } from './permission.mapper';

export function roleOrmToDomain(orm: RoleOrmEntity): RoleEntity {
  return RoleEntityClass.create({
    id: orm.domain_id,
    roleName: orm.role_name,
    description: orm.description ?? undefined,
    permissions: orm.permissions?.map((p: PermissionOrmEntity) => permissionOrmToDomain(p)),
    createdAt: undefined,
    updatedAt: undefined,
  });
}

export function roleDomainToOrm(entity: RoleEntity): Partial<RoleOrmEntity> {
  return {
    technical_id: entity.id,
    domain_id: entity.id,
    role_name: entity.roleName,
    description: entity.description ?? null,
  };
}
