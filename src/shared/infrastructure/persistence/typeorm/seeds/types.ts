import { DataSource } from 'typeorm';

/**
 * Contract for a master-data seed.
 * Seeds MUST only insert/update reference data (roles, permissions, etc.),
 * never transactional data (orders, users, payments).
 */
export interface Seed {
  name: string;
  run(dataSource: DataSource): Promise<void>;
}
