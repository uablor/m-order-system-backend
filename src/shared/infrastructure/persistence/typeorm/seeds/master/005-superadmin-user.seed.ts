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
import { userDomainToOrm } from 'src/bounded-contexts/identity-access/infrastructure/persistence/mappers/user.mapper';
import { UniqueEntityId } from '@shared/domain';
import { Email } from 'src/bounded-contexts/identity-access/domain/value-objects';
import { UserAggregate } from 'src/bounded-contexts/identity-access/domain/aggregates/user.aggregate';

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
    const userDomainId = uuid();
    await userRepo.save(
      userRepo.create(userDomainToOrm(UserAggregate.create({
        id: UniqueEntityId.create(userDomainId),
        email: SUPERADMIN_EMAIL,
        passwordHash,
        fullName: SUPERADMIN_FULL_NAME,
        merchantId: merchant.id,
        roleId: adminRole.id,
        isActive: true,
      }))),
    );
  },
};
