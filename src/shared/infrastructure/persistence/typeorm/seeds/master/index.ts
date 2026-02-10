/**
 * Master data seeds only. Never transactional data.
 * Bootstrap: merchant, superadmin user, platform roles, platform permissions, platform superadmin.
 */
import { Seed } from '../types';
import { seed001Permissions } from './001-permissions.seed';
import { seed002Roles } from './002-roles.seed';
import { seed003RolePermissions } from './003-role-permissions.seed';
import { seed004Merchant } from './004-merchant.seed';
import { seed005SuperadminUser } from './005-superadmin-user.seed';
import { seed006PlatformRoles } from './006-platform-roles.seed';
import { seed007PlatformPermissions } from './007-platform-permissions.seed';
import { seed008PlatformSuperadmin } from './008-platform-superadmin.seed';

export const masterSeeds: Seed[] = [
  seed001Permissions,
  seed002Roles,
  seed003RolePermissions,
  seed004Merchant,
  seed005SuperadminUser,
  seed006PlatformRoles,
  seed007PlatformPermissions,
  seed008PlatformSuperadmin,
];
