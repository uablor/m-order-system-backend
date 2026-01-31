/**
 * Central registry of all TypeORM entities for Nest + DataSource.
 * Use this array so TypeORM has metadata when running via ts-node (e.g. seed).
 */
import {
  PermissionOrmEntity,
  RoleOrmEntity,
  UserOrmEntity,
  MerchantOrmEntity,
  CustomerOrmEntity,
} from '../bounded-contexts/user-management/infrastructure/persistence/entities';
import {
  OrderOrmEntity,
  OrderItemOrmEntity,
  CustomerOrderOrmEntity,
  CustomerOrderItemOrmEntity,
  ArrivalOrmEntity,
  ArrivalItemOrmEntity,
  NotificationOrmEntity,
  PaymentOrmEntity,
  CustomerMessageOrmEntity,
  ExchangeRateOrmEntity,
} from '../bounded-contexts/order-management/infrastructure/persistence/entities';

export const ormEntities = [
  PermissionOrmEntity,
  RoleOrmEntity,
  UserOrmEntity,
  MerchantOrmEntity,
  CustomerOrmEntity,
  OrderOrmEntity,
  OrderItemOrmEntity,
  CustomerOrderOrmEntity,
  CustomerOrderItemOrmEntity,
  ArrivalOrmEntity,
  ArrivalItemOrmEntity,
  NotificationOrmEntity,
  PaymentOrmEntity,
  CustomerMessageOrmEntity,
  ExchangeRateOrmEntity,
];
