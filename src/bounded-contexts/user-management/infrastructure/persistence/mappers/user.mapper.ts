import type { UserEntity } from '../../../domain/entities/user.entity';
import { UserEntity as UserEntityClass } from '../../../domain/entities/user.entity';
import type { UserOrmEntity } from '../entities/user.orm-entity';

export function userOrmToDomain(orm: UserOrmEntity): UserEntity {
  return UserEntityClass.create({
    id: orm.domain_id,
    email: orm.email,
    passwordHash: orm.password_hash,
    fullName: orm.full_name,
    roleId: orm.technical_role_id,
    merchantId: orm.technical_merchant_id,
    isActive: orm.is_active,
    lastLogin: orm.last_login ?? undefined,
    role: orm.role ? { roleName: orm.role.role_name } : undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function userOrmToDomainWithRole(orm: UserOrmEntity): UserEntity {
  return userOrmToDomain(orm);
}

export function userDomainToOrm(entity: UserEntity): Partial<UserOrmEntity> {
  return {
    technical_id: entity.id,
    domain_id: entity.id,
    email: entity.email,
    password_hash: entity.passwordHash,
    full_name: entity.fullName,
    technical_role_id: entity.roleId,
    technical_merchant_id: entity.merchantId,
    is_active: entity.isActive,
    last_login: entity.lastLogin ?? null,
  };
}
