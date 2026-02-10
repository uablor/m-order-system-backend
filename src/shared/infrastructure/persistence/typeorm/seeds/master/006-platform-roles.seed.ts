/**
 * Platform roles: SUPER_ADMIN, PLATFORM_ADMIN, SUPPORT.
 * Idempotent.
 */
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import { PlatformRoleOrmEntity } from '../../../../../../bounded-contexts/identity-access/infrastructure/persistence/entities';
import { Seed } from '../types';

const PLATFORM_ROLE_NAMES = ['SUPER_ADMIN', 'PLATFORM_ADMIN', 'SUPPORT'];

export const seed006PlatformRoles: Seed = {
  name: '006-platform-roles',
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(PlatformRoleOrmEntity);
    for (const name of PLATFORM_ROLE_NAMES) {
      const existing = await repo.findOne({ where: { name } });
      if (!existing) {
        const domainId = uuid();
        const entity = repo.create({
          id: domainId,
          domain_id: domainId,
          name,
        });
        await repo.save(entity);
      }
    }
  },
};
