/**
 * Central registry of all TypeORM entities for Nest + DataSource.
 */
import {
  PermissionOrmEntity,
  RoleOrmEntity,
  RolePermissionOrmEntity,
  UserOrmEntity,
} from '../bounded-contexts/identity-access/infrastructure/persistence/entities';
import { MerchantOrmEntity } from '../bounded-contexts/merchant-management/infrastructure/persistence/entities';
import { CustomerOrmEntity } from '../bounded-contexts/customer-management/infrastructure/persistence/entities';

export const ormEntities = [
  PermissionOrmEntity,
  RoleOrmEntity,
  RolePermissionOrmEntity,
  UserOrmEntity,
  MerchantOrmEntity,
  CustomerOrmEntity,
];
