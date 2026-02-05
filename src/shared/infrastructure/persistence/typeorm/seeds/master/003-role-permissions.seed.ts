/**
 * Master data: role-permission links.
 * DDD rule: seed only reference data, never transactional data.
 */
import { DataSource, IsNull } from 'typeorm';
import {
  RoleOrmEntity,
  PermissionOrmEntity,
  RolePermissionOrmEntity,
} from '../../../../../../bounded-contexts/identity-access/infrastructure/persistence/entities';
import { Seed } from '../types';

/** role name -> permission codes */
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'order:view', 'order:create', 'order:update', 'order:delete',
    'customer:view', 'customer:create', 'customer:update',
    'merchant:view', 'merchant:manage',
    'user:view', 'user:manage', 'role:manage',
    'payment:view', 'payment:record',
    'arrival:view', 'arrival:record',
  ],
  merchant: [
    'order:view', 'order:create', 'order:update',
    'customer:view', 'customer:create', 'customer:update',
    'merchant:view',
    'payment:view', 'payment:record',
    'arrival:view', 'arrival:record',
  ],
  staff: [
    'order:view', 'order:create',
    'customer:view',
    'payment:view', 'payment:record',
    'arrival:view', 'arrival:record',
  ],
};

export const seed003RolePermissions: Seed = {
  name: '003-role-permissions',
  async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(RoleOrmEntity);
    const permRepo = dataSource.getRepository(PermissionOrmEntity);
    const rpRepo = dataSource.getRepository(RolePermissionOrmEntity);

    for (const [roleName, codes] of Object.entries(ROLE_PERMISSIONS)) {
      const role = await roleRepo.findOne({ where: { name: roleName, merchant_id: IsNull() } });
      if (!role) continue;

      for (const code of codes) {
        const perm = await permRepo.findOne({ where: { code } });
        if (!perm) continue;

        const exists = await rpRepo.findOne({
          where: { role_id: role.id, permission_id: perm.id },
        });
        if (!exists) {
          await rpRepo.save(
            rpRepo.create({ role_id: role.id, permission_id: perm.id }),
          );
        }
      }
    }
  },
};
