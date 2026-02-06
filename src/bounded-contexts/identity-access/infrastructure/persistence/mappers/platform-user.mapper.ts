import { UniqueEntityId } from '../../../../../shared/domain/value-objects/unique-entity-id.vo';
import { PlatformUserAggregate } from '../../../domain/aggregates/platform-user.aggregate';
import { Email } from '../../../domain/value-objects/email.vo';
import type { PlatformRole } from '../../../domain/value-objects/platform-role.vo';
import type { PlatformUserOrmEntity } from '../entities/platform-user.orm-entity';

export function platformUserOrmToDomain(orm: PlatformUserOrmEntity): PlatformUserAggregate {
  return PlatformUserAggregate.fromPersistence({
    id: UniqueEntityId.create(orm.domain_id ?? orm.id),
    email: Email.create(orm.email),
    passwordHash: orm.password_hash,
    fullName: orm.full_name,
    role: orm.role as PlatformRole,
    isActive: orm.is_active,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function platformUserDomainToOrm(
  aggregate: PlatformUserAggregate,
): Partial<PlatformUserOrmEntity> {
  const id = typeof aggregate.id === 'string' ? aggregate.id : aggregate.id.value;
  return {
    id,
    domain_id: id,
    email: aggregate.email.value,
    password_hash: aggregate.passwordHash,
    full_name: aggregate.fullName,
    role: aggregate.role,
    is_active: aggregate.isActive,
    updated_at: aggregate.updatedAt ?? new Date(),
  };
}
