/**
 * Standalone TypeORM DataSource for CLI (migrations, seeds).
 * Do not use NestJS here — load env and entities only.
 */
import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { ormEntities } from '../../../../config/orm-entities';

const migrationDir = path.join(__dirname, 'migrations');
const ext = __filename.endsWith('.ts') ? 'ts' : 'js';
const migrationPattern = path.join(migrationDir, `*.${ext}`);

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? 'm_order_system',
  entities: ormEntities,
  migrations: [migrationPattern],
  logging: process.env.DB_LOGGING !== 'false',
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: { connectionLimit: 10 },
});
