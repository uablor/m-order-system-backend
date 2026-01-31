import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { PermissionOrmEntity } from './permission.orm-entity';

@Entity('roles', { engine: 'InnoDB' })
export class RoleOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  technical_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  role_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ManyToMany(() => PermissionOrmEntity)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'technical_role_id', referencedColumnName: 'technical_id' },
    inverseJoinColumn: { name: 'technical_permission_id', referencedColumnName: 'technical_id' },
  })
  permissions!: PermissionOrmEntity[];
}
