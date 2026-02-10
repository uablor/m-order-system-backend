import { applyDecorators, SetMetadata } from '@nestjs/common';

export const AUTO_PERMISSIONS_KEY = 'autoPermissions';
export const AUTO_PERMISSIONS_RESOURCE_KEY = 'autoPermissionsResource';

/**
 * Enable auto-derived permission check for this controller.
 * Permission = resource.action (e.g. platform_user.create).
 * Action is derived from HTTP method and handler name.
 */
export interface AutoPermissionsOptions {
  /** Permission resource (e.g. platform_user, user, order). */
  resource: string;
}

export const AutoPermissions = (options: AutoPermissionsOptions) =>
  applyDecorators(
    SetMetadata(AUTO_PERMISSIONS_KEY, true),
    SetMetadata(AUTO_PERMISSIONS_RESOURCE_KEY, options.resource),
  );
