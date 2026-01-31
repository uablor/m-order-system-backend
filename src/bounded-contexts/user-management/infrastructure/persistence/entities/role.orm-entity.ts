import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { PermissionOrmEntity } from './permission.orm-entity';

@Entity('roles', { engine: 'InnoDB' })
export class RoleOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  role_id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  role_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ManyToMany(() => PermissionOrmEntity)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'permission_id' },
  })
  permissions!: PermissionOrmEntity[];
}
