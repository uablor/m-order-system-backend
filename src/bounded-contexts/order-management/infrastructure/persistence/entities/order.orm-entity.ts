import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders', { engine: 'InnoDB' })
export class OrderOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  order_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'char', length: 36 })
  created_by!: string;

  @Column({ type: 'varchar', length: 50 })
  order_code!: string;

  @Column({ type: 'date' })
  order_date!: Date;

  @Column({ type: 'varchar', length: 20 })
  arrival_status!: string;

  @Column({ type: 'date', nullable: true })
  arrived_at!: Date | null;

  @Column({ type: 'date', nullable: true })
  notified_at!: Date | null;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_purchase_cost_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_shipping_cost_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_cost_before_discount_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_discount_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_final_cost_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_final_cost_thb!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_selling_amount_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_selling_amount_thb!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_profit_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_profit_thb!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  deposit_amount!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  paid_amount!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  remaining_amount!: number;

  @Column({ type: 'varchar', length: 20 })
  payment_status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
