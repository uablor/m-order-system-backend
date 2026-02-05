import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity';

@Entity('order_items', { engine: 'InnoDB' })
export class OrderItemOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  item_id!: string;

  @Column({ type: 'char', length: 36 })
  order_id!: string;

  @ManyToOne(() => OrderOrmEntity, (o) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: OrderOrmEntity;

  @Column({ type: 'varchar', length: 255 })
  product_name!: string;

  @Column({ type: 'varchar', length: 128, default: '' })
  variant!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'varchar', length: 8 })
  purchase_currency!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  purchase_price!: string;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  purchase_exchange_rate!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  purchase_total_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  total_cost_before_discount_lak!: string;

  @Column({ type: 'varchar', length: 16 })
  discount_type!: string; // PERCENT | FIX

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  discount_value!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  discount_amount_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  final_cost_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  final_cost_thb!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  selling_price_foreign!: string;

  @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
  selling_exchange_rate!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  selling_total_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  profit_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  profit_thb!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
