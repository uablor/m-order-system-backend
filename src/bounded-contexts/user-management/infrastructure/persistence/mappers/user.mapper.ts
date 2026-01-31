import type { UserEntity, RoleEntity } from '../../../domain/entities';
import { UserEntity as UserEntityClass } from '../../../domain/entities/user.entity';
import type { UserOrmEntity } from '../entities';
import { roleOrmToDomain } from './role.mapper';

export function userOrmToDomain(orm: UserOrmEntity, role?: RoleEntity): UserEntity {
  return UserEntityClass.create({
    id: orm.domain_id,
    email: orm.email,
    passwordHash: orm.password_hash,
    fullName: orm.full_name,
    roleId: orm.role_id,
    merchantId: orm.merchant_id,
    isActive: orm.is_active,
    lastLogin: orm.last_login ?? undefined,
    role: role ? { roleName: role.roleName } : undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function userDomainToOrm(entity: UserEntity): Partial<UserOrmEntity> {
  return {
    domain_id: entity.id,
    email: entity.email,
    password_hash: entity.passwordHash,
    full_name: entity.fullName,
    role_id: entity.roleId,
    merchant_id: entity.merchantId,
    is_active: entity.isActive,
    last_login: entity.lastLogin ?? null,
    updated_at: entity.updatedAt ?? new Date(),
  };
}

export function userOrmToDomainWithRole(orm: UserOrmEntity): UserEntity {
  const role = orm.role ? roleOrmToDomain(orm.role) : undefined;
  return userOrmToDomain(orm, role);
}
