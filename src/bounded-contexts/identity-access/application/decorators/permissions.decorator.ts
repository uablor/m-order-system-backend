import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../../infrastructure/external-services/roles.guard';

/**
 * Require at least one of the given permissions (permission-based auth).
 * Used with RolesGuard; for platform users, JWT must include permissions (from role).
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
