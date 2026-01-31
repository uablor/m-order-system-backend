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
  merchant_id!: string;

  @Column({ type: 'char', length: 36 })
  owner_user_id!: string;

  @Column({ type: 'varchar', length: 255 })
  shop_name!: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  shop_logo_url!: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  shop_address!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact_phone!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_email!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_facebook!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_line!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_whatsapp!: string | null;

  @Column({ type: 'varchar', length: 10 })
  default_currency!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
