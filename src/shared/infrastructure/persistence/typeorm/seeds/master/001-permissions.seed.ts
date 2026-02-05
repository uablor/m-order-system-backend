/**
 * Master data: permissions.
 * DDD rule: seed only reference data, never transactional data.
 */
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import { PermissionOrmEntity } from '../../../../../../bounded-contexts/identity-access/infrastructure/persistence/entities';
import { Seed } from '../types';

const PERMISSIONS: Array<{ code: string; name: string; description: string | null }> = [
  { code: 'order:view', name: 'View orders', description: 'View order list and details' },
  { code: 'order:create', name: 'Create order', description: 'Create new orders' },
  { code: 'order:update', name: 'Update order', description: 'Update existing orders' },
  { code: 'order:delete', name: 'Delete order', description: 'Delete orders' },
  { code: 'customer:view', name: 'View customers', description: 'View customer list and details' },
  { code: 'customer:create', name: 'Create customer', description: 'Create customers' },
  { code: 'customer:update', name: 'Update customer', description: 'Update customers' },
  { code: 'merchant:view', name: 'View merchants', description: 'View merchant list and details' },
  { code: 'merchant:manage', name: 'Manage merchants', description: 'Create and update merchants' },
  { code: 'user:view', name: 'View users', description: 'View user list and details' },
  { code: 'user:manage', name: 'Manage users', description: 'Create and update users' },
  { code: 'role:manage', name: 'Manage roles', description: 'Assign roles and permissions' },
  { code: 'payment:view', name: 'View payments', description: 'View payment records' },
  { code: 'payment:record', name: 'Record payment', description: 'Record payments' },
  { code: 'arrival:view', name: 'View arrivals', description: 'View arrival records' },
  { code: 'arrival:record', name: 'Record arrival', description: 'Record arrivals' },
];

export const seed001Permissions: Seed = {
  name: '001-permissions',
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(PermissionOrmEntity);
    for (const p of PERMISSIONS) {
      const existing = await repo.findOne({ where: { code: p.code } });
      if (!existing) {
        const domainId = uuid();
        const entity = repo.create({
          id: domainId,
          domain_id: domainId,
          code: p.code,
          name: p.name,
          description: p.description,
        });
        await repo.save(entity);
      }
    }
  },
};
