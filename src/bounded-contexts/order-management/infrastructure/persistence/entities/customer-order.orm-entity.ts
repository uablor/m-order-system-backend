import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('customer_orders', { engine: 'InnoDB' })
export class CustomerOrderOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  technical_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_order_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_customer_id!: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_selling_amount_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_paid!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  remaining_amount!: number;

  @Column({ type: 'varchar', length: 20 })
  payment_status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
