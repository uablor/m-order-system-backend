import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItemOrmEntity } from './order-item.orm-entity';

@Entity('orders', { engine: 'InnoDB' })
export class OrderOrmEntity {
  /** Technical PK (kept for FK). Use domain_id for business identity. */
  @PrimaryColumn('char', { length: 36 })
  order_id!: string;

  /** Domain identity (UUID). Domain layer uses this only. */
  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'char', length: 36 })
  created_by!: string;

  @Column({ type: 'varchar', length: 64 })
  order_code!: string;

  @Column({ type: 'date' })
  order_date!: Date;

  @Column({ type: 'varchar', length: 32, default: 'DRAFT' })
  status!: string; // DRAFT | CONFIRMED | CLOSED

  @Column({ type: 'varchar', length: 32 })
  arrival_status!: string; // NOT_ARRIVED | ARRIVED

  @Column({ type: 'timestamp', nullable: true })
  arrived_at!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  notified_at!: Date | null;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_purchase_cost_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_shipping_cost_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_cost_before_discount_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_discount_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_final_cost_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_final_cost_thb!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_selling_amount_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_selling_amount_thb!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_profit_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_profit_thb!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  deposit_amount!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  paid_amount!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  remaining_amount!: string;

  @Column({ type: 'varchar', length: 32 })
  payment_status!: string; // UNPAID | PARTIAL | PAID

  @Column({ type: 'boolean', default: false })
  is_closed!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order)
  items!: OrderItemOrmEntity[];
}
