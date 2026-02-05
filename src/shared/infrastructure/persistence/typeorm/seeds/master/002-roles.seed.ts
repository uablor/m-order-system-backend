/**
 * Master data: roles.
 * DDD rule: seed only reference data, never transactional data.
 */
import { v4 as uuid } from 'uuid';
import { DataSource, IsNull } from 'typeorm';
import { RoleOrmEntity } from '../../../../../../bounded-contexts/identity-access/infrastructure/persistence/entities';
import { Seed } from '../types';

const ROLES: Array<{ name: string; merchantId: string | null }> = [
  { name: 'admin', merchantId: null },
  { name: 'merchant', merchantId: null },
  { name: 'staff', merchantId: null },
];

export const seed002Roles: Seed = {
  name: '002-roles',
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(RoleOrmEntity);
    for (const r of ROLES) {
      const existing = await repo.findOne({
      where: { name: r.name, merchant_id: r.merchantId ?? IsNull() },
    });
      if (!existing) {
        const entity = repo.create({
          id: uuid(),
          name: r.name,
          merchant_id: r.merchantId,
        });
        await repo.save(entity);
      }
    }
  },
};
