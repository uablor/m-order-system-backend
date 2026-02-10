import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { UserAggregate } from '../../../domain/aggregates/user.aggregate';
import { UserAggregate as UserClass } from '../../../domain/aggregates/user.aggregate';
import { UserOrmEntity } from '../entities/user.orm-entity';

export function userOrmToDomain(orm: UserOrmEntity): UserAggregate {
  return UserClass.fromPersistence({
    id: UniqueEntityId.create(orm.domain_id),
    email: orm.email,
    passwordHash: orm.password_hash,
    fullName: orm.full_name,
    merchantId: orm.merchant_id,
    roleId: orm.role_id,
    isActive: orm.is_active,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}
export function userDomainToOrm(agg: UserAggregate): Partial<UserOrmEntity> {
  const domainId = typeof agg.id === 'string' ? agg.id : agg.id.value;

  return {
    domain_id: domainId,
    email: agg.email,
    password_hash: agg.passwordHash,
    full_name: agg.fullName,
    merchant_id: agg.merchantId,
    role_id: agg.roleId,
    is_active: agg.isActive,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
