/**
 * Bootstrap: superadmin user (superadmin@gmail.com / superadmin). Idempotent.
 */
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { DataSource, IsNull } from 'typeorm';
import {
  UserOrmEntity,
  RoleOrmEntity,
} from '../../../../../../bounded-contexts/identity-access/infrastructure/persistence/entities';
import { MerchantOrmEntity } from '../../../../../../bounded-contexts/merchant-management/infrastructure/persistence/entities';
import { Seed } from '../types';

const SUPERADMIN_EMAIL = 'superadmin@gmail.com';
const SUPERADMIN_PASSWORD = 'superadmin';
const SUPERADMIN_FULL_NAME = 'Super Admin';
const BCRYPT_ROUNDS = 10;

export const seed005SuperadminUser: Seed = {
  name: '005-superadmin-user',
  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(UserOrmEntity);
    const existing = await userRepo.findOne({ where: { email: SUPERADMIN_EMAIL } });
    if (existing) return;

    const merchantRepo = dataSource.getRepository(MerchantOrmEntity);
    const merchant = await merchantRepo.findOne({
      where: { shop_name: 'Main Merchant' },
    });
    if (!merchant) throw new Error('Main Merchant not found. Run 004-merchant seed first.');

    const roleRepo = dataSource.getRepository(RoleOrmEntity);
    const adminRole = await roleRepo.findOne({
      where: { name: 'admin', merchant_id: IsNull() },
    });
    if (!adminRole) throw new Error('Admin role not found. Run 002-roles seed first.');

    const passwordHash = await bcrypt.hash(SUPERADMIN_PASSWORD, BCRYPT_ROUNDS);
    await userRepo.save(
      userRepo.create({
        id: uuid(),
        email: SUPERADMIN_EMAIL,
        password_hash: passwordHash,
        full_name: SUPERADMIN_FULL_NAME,
        merchant_id: merchant.id,
        role_id: adminRole.id,
        is_active: true,
      }),
    );

    // Link merchant owner to this user (update after insert to avoid circular dep)
    const created = await userRepo.findOne({ where: { email: SUPERADMIN_EMAIL } });
    if (created) {
      await merchantRepo.update(
        { id: merchant.id },
        { owner_user_id: created.id },
      );
    }
  },
};
