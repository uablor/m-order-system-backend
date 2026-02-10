/**
 * Platform SUPER ADMIN user: superadmin@admin.com / superadmin.
 * Uses repository pattern and domain aggregate (no direct ORM save).
 * Idempotent.
 */
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import { PlatformUserAggregate } from '../../../../../../bounded-contexts/identity-access/domain/aggregates/platform-user.aggregate';
import { Email } from '../../../../../../bounded-contexts/identity-access/domain/value-objects/email.vo';
import { UniqueEntityId } from '../../../../../../shared/domain/value-objects/unique-entity-id.vo';
import { PlatformUserOrmEntity } from '../../../../../../bounded-contexts/identity-access/infrastructure/persistence/entities';
import { PlatformUserRepositoryImpl } from '../../../../../../bounded-contexts/identity-access/infrastructure/persistence/repositories/platform-user.repository.impl';
import { BcryptPasswordHasher } from '../../../../../../bounded-contexts/identity-access/infrastructure/external-services/bcrypt-password-hasher';
import { Seed } from '../types';

const PLATFORM_SUPERADMIN_EMAIL = 'superadmin@admin.com';
const PLATFORM_SUPERADMIN_PASSWORD = 'superadmin';
const PLATFORM_SUPERADMIN_FULL_NAME = 'Platform Super Admin';

export const seed008PlatformSuperadmin: Seed = {
  name: '008-platform-superadmin',
  async run(dataSource: DataSource): Promise<void> {
    const repo = new PlatformUserRepositoryImpl(
      dataSource.getRepository(PlatformUserOrmEntity),
    );
    const hasher = new BcryptPasswordHasher();

    const existing = await repo.findByEmail(PLATFORM_SUPERADMIN_EMAIL);
    if (existing) return;

    const passwordHash = await hasher.hash(PLATFORM_SUPERADMIN_PASSWORD);
    const user = PlatformUserAggregate.create({
      id: UniqueEntityId.create(uuid()),
      email: Email.create(PLATFORM_SUPERADMIN_EMAIL),
      passwordHash,
      fullName: PLATFORM_SUPERADMIN_FULL_NAME,
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    console.log("user", user);
    await repo.save(user);
  },
};
