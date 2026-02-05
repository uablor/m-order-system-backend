/**
 * Master data seeds only. Never transactional data.
 * Bootstrap: merchant, superadmin user.
 */
import { Seed } from '../types';
import { seed001Permissions } from './001-permissions.seed';
import { seed002Roles } from './002-roles.seed';
import { seed003RolePermissions } from './003-role-permissions.seed';
import { seed004Merchant } from './004-merchant.seed';
import { seed005SuperadminUser } from './005-superadmin-user.seed';

export const masterSeeds: Seed[] = [
  seed001Permissions,
  seed002Roles,
  seed003RolePermissions,
  seed004Merchant,
  seed005SuperadminUser,
];
