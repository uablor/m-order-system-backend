/**
 * Links platform roles to existing permissions (same permission table).
 */

export const PLATFORM_ROLE_PERMISSION_REPOSITORY = Symbol(
  'PLATFORM_ROLE_PERMISSION_REPOSITORY',
);

export interface IPlatformRolePermissionRepository {
  /** Get permission codes for a platform role by role name. */
  getPermissionCodesByPlatformRoleName(roleName: string): Promise<string[]>;

  /** Replace all permissions for a platform role (by role domain id). */
  setPermissionsForPlatformRole(
    platformRoleDomainId: string,
    permissionDomainIds: string[],
  ): Promise<void>;
}
