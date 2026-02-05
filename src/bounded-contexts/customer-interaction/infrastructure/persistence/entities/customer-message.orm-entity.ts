import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('customer_messages', { engine: 'InnoDB' })
export class CustomerMessageOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  message_id!: string;

  @Column({ type: 'char', length: 36 })
  customer_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'char', length: 36, nullable: true })
  order_id!: string | null;

  @Column({ type: 'varchar', length: 16 })
  message_type!: string; // TEXT | IMAGE

  @Column({ type: 'text' })
  message_content!: string;

  @Column({ type: 'text', nullable: true })
  file_url!: string | null;

  @Column({ type: 'boolean', default: false })
  is_read!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  read_at!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
