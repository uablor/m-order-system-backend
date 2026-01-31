import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('customer_messages', { engine: 'InnoDB' })
export class CustomerMessageOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  technical_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_customer_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_merchant_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_order_id!: string;

  @Column({ type: 'varchar', length: 50 })
  message_type!: string;

  @Column({ type: 'text' })
  message_content!: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  file_url!: string | null;

  @Column({ type: 'boolean', default: false })
  is_read!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  read_at!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
