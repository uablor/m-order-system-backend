import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('role_permissions', { engine: 'InnoDB' })
export class RolePermissionOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  role_id!: string;

  @PrimaryColumn('char', { length: 36 })
  permission_id!: string;
}
