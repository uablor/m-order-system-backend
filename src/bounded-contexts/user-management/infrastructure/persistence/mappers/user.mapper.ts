import { Email, Password } from 'src/bounded-contexts/user-management/domain/value-objects';
import type { UserEntity } from '../../../domain/entities/user.entity';
import { UserEntity as UserEntityClass } from '../../../domain/entities/user.entity';
import type { UserOrmEntity } from '../entities/user.orm-entity';
import { UniqueEntityId } from 'src/shared/domain/value-objects';
import { FullName } from 'src/bounded-contexts/user-management/domain/value-objects/full-name.vo';

export function userOrmToDomain(orm: UserOrmEntity): UserEntity {
  return UserEntityClass.create({
    id: UniqueEntityId.create(orm.domain_id),
    email: Email.create(orm.email),
    passwordHash: Password.fromHash(orm.password_hash),
    fullName: FullName.create(orm.full_name),
    roleId: UniqueEntityId.create(orm.technical_role_id),
    merchantId: UniqueEntityId.create(orm.technical_merchant_id),
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
    domain_id: entity.id.value,
    email: entity.email.value,
    password_hash: entity.passwordHash.hash,
    full_name: entity.fullName.value,
    technical_role_id: entity.roleId.value,
    technical_merchant_id: entity.merchantId.value,
    is_active: entity.isActive,
    last_login: entity.lastLogin ?? null,
  };
}
