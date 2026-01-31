import { registerAs } from '@nestjs/config';
import { ormEntities } from './orm-entities';

export default registerAs('database', () => ({
  type: 'mysql' as const,
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? 'm_order_system',
  entities: ormEntities,
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
  logging: process.env.DB_LOGGING !== 'false',
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: { connectionLimit: 10 },
}));
