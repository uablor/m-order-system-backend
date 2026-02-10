import { Entity, PrimaryColumn } from 'typeorm';

/**
 * Join table: platform_roles <-> permissions (existing permission table).
 */
@Entity('platform_role_permissions', { engine: 'InnoDB' })
export class PlatformRolePermissionOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  platform_role_id!: string;

  @PrimaryColumn('char', { length: 36 })
  permission_id!: string;
}
