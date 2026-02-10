/**
 * 1) Ensure controller-derived permissions exist (module.action).
 * 2) Assign ALL permissions to SUPER_ADMIN platform role.
 * Idempotent. Uses existing permission table.
 */
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import {
  PermissionOrmEntity,
  PlatformRoleOrmEntity,
  PlatformRolePermissionOrmEntity,
} from '../../../../../../bounded-contexts/identity-access/infrastructure/persistence/entities';
import { Seed } from '../types';

/** Controller-derived permissions: <module>.<action> */
const CONTROLLER_PERMISSIONS: Array<{ code: string; name: string }> = [
  { code: 'platform_user.create', name: 'Create platform user' },
  { code: 'platform_user.list', name: 'List platform users' },
  { code: 'platform_user.read', name: 'Read platform user' },
  { code: 'platform_user.update', name: 'Update platform user' },
  { code: 'platform_user.delete', name: 'Delete platform user' },
  { code: 'platform_role.create', name: 'Create platform role' },
  { code: 'platform_role.list', name: 'List platform roles' },
  { code: 'platform_role.read', name: 'Read platform role' },
  { code: 'platform_role.update', name: 'Update platform role' },
  { code: 'platform_role.delete', name: 'Delete platform role' },
  { code: 'user.create', name: 'Create user' },
  { code: 'user.list', name: 'List users' },
  { code: 'user.read', name: 'Read user' },
  { code: 'user.update', name: 'Update user' },
  { code: 'user.delete', name: 'Delete user' },
  { code: 'role.create', name: 'Create role' },
  { code: 'role.list', name: 'List roles' },
  { code: 'role.read', name: 'Read role' },
  { code: 'role.update', name: 'Update role' },
  { code: 'role.delete', name: 'Delete role' },
  { code: 'role.put_permissions', name: 'Put role permissions' },
  { code: 'permission.list', name: 'List permissions' },
  { code: 'order.create', name: 'Create order' },
  { code: 'order.list', name: 'List orders' },
  { code: 'order.read', name: 'Read order' },
  { code: 'order.update', name: 'Update order' },
  { code: 'order.delete', name: 'Delete order' },
  { code: 'order.add_items', name: 'Add order items' },
  { code: 'order.update_items', name: 'Update order items' },
  { code: 'order.calculate', name: 'Calculate order' },
  { code: 'order.close', name: 'Close order' },
  { code: 'customer_order.create', name: 'Create customer order' },
  { code: 'customer_order.list', name: 'List customer orders' },
  { code: 'customer_order.read', name: 'Read customer order' },
  { code: 'customer_order.delete', name: 'Delete customer order' },
  { code: 'customer_order.add_items', name: 'Add customer order items' },
  { code: 'customer.create', name: 'Create customer' },
  { code: 'customer.list', name: 'List customers' },
  { code: 'customer.read', name: 'Read customer' },
  { code: 'customer.update', name: 'Update customer' },
  { code: 'customer.delete', name: 'Delete customer' },
  { code: 'merchant.create', name: 'Create merchant' },
  { code: 'merchant.list', name: 'List merchants' },
  { code: 'merchant.read', name: 'Read merchant' },
  { code: 'merchant.update', name: 'Update merchant' },
  { code: 'merchant.delete', name: 'Delete merchant' },
  { code: 'payment.create', name: 'Create payment' },
  { code: 'payment.list', name: 'List payments' },
  { code: 'payment.read', name: 'Read payment' },
  { code: 'payment.update', name: 'Update payment' },
  { code: 'payment.verify', name: 'Verify payment' },
  { code: 'payment.reject', name: 'Reject payment' },
  { code: 'notification.create', name: 'Create notification' },
  { code: 'notification.list', name: 'List notifications' },
  { code: 'notification.read', name: 'Read notification' },
  { code: 'notification.retry', name: 'Retry notification' },
  { code: 'exchange_rate.create', name: 'Create exchange rate' },
  { code: 'exchange_rate.list', name: 'List exchange rates' },
  { code: 'exchange_rate.read', name: 'Read exchange rate' },
  { code: 'exchange_rate.update', name: 'Update exchange rate' },
  { code: 'exchange_rate.delete', name: 'Delete exchange rate' },
  { code: 'arrival.create', name: 'Create arrival' },
  { code: 'arrival.list', name: 'List arrivals' },
  { code: 'arrival.read', name: 'Read arrival' },
  { code: 'arrival.add_items', name: 'Add arrival items' },
  { code: 'arrival.confirm', name: 'Confirm arrival' },
  { code: 'message.create', name: 'Create message' },
  { code: 'message.list', name: 'List messages' },
  { code: 'message.read', name: 'Read message' },
  { code: 'message.update', name: 'Update message' },
];

export const seed007PlatformPermissions: Seed = {
  name: '007-platform-permissions',
  async run(dataSource: DataSource): Promise<void> {
    const permRepo = dataSource.getRepository(PermissionOrmEntity);
    const roleRepo = dataSource.getRepository(PlatformRoleOrmEntity);
    const linkRepo = dataSource.getRepository(PlatformRolePermissionOrmEntity);

    for (const p of CONTROLLER_PERMISSIONS) {
      const existing = await permRepo.findOne({ where: { code: p.code } });
      if (!existing) {
        const domainId = uuid();
        const entity = permRepo.create({
          id: domainId,
          domain_id: domainId,
          code: p.code,
          name: p.name,
          description: null,
        });
        await permRepo.save(entity);
      }
    }

    const superAdminRole = await roleRepo.findOne({
      where: { name: 'SUPER_ADMIN' },
    });
    if (!superAdminRole) {
      throw new Error('SUPER_ADMIN platform role not found. Run 006-platform-roles first.');
    }

    const allPermissions = await permRepo.find({ select: ['id'] });
    await linkRepo.delete({ platform_role_id: superAdminRole.id });
    if (allPermissions.length > 0) {
      const links = allPermissions.map((perm) =>
        linkRepo.create({
          platform_role_id: superAdminRole.id,
          permission_id: perm.id,
        }),
      );
      await linkRepo.save(links);
    }
  },
};
