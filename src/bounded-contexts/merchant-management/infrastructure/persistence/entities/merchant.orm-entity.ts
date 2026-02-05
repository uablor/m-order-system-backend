import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('merchants', { engine: 'InnoDB' })
export class MerchantOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'varchar', length: 255 })
  shop_name!: string;

  @Column({ type: 'varchar', length: 10 })
  default_currency!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'char', length: 36, nullable: true })
  owner_user_id!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
