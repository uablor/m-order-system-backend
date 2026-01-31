import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customers', { engine: 'InnoDB' })
export class CustomerOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  customer_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'varchar', length: 255 })
  customer_name!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  customer_type!: string | null;

  @Column({ type: 'text', nullable: true })
  shipping_address!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shipping_provider!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shipping_source!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shipping_destination!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  payment_terms!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact_phone!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_facebook!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_whatsapp!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_line!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  preferred_contact_method!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  unique_token!: string | null;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
