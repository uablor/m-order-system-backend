import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';

@Entity('users', { engine: 'InnoDB' })
export class UserOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  user_id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({ type: 'varchar', length: 255 })
  full_name!: string;

  @Column({ type: 'char', length: 36 })
  role_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login!: Date | null;

  @ManyToOne(() => RoleOrmEntity, { eager: false })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'role_id' })
  role!: RoleOrmEntity | null;
}
