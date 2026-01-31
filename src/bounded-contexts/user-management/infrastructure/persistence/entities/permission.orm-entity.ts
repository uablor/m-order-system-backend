import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('permissions', { engine: 'InnoDB' })
export class PermissionOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  technical_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  permission_code!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;
}
