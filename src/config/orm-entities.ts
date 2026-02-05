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
import {
  ExchangeRateOrmEntity,
  OrderOrmEntity,
  OrderItemOrmEntity,
  CustomerOrderOrmEntity,
  CustomerOrderItemOrmEntity,
  ArrivalOrmEntity,
  ArrivalItemOrmEntity,
} from '../bounded-contexts/order-management/infrastructure/persistence/entities';

export const ormEntities = [
  PermissionOrmEntity,
  RoleOrmEntity,
  RolePermissionOrmEntity,
  UserOrmEntity,
  MerchantOrmEntity,
  CustomerOrmEntity,
  ExchangeRateOrmEntity,
  OrderOrmEntity,
  OrderItemOrmEntity,
  CustomerOrderOrmEntity,
  CustomerOrderItemOrmEntity,
  ArrivalOrmEntity,
  ArrivalItemOrmEntity,
];
