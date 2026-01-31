import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('order_items', { engine: 'InnoDB' })
export class OrderItemOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  item_id!: string;

  @Column({ type: 'char', length: 36 })
  order_id!: string;

  @Column({ type: 'varchar', length: 255 })
  product_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  variant!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  quantity!: number;

  @Column({ type: 'varchar', length: 10 })
  purchase_currency!: string;

  @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
  purchase_price!: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
  purchase_exchange_rate!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  purchase_total_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_cost_before_discount_lak!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  discount_type!: string | null;

  @Column({ type: 'decimal', precision: 18, scale: 4, nullable: true })
  discount_value!: number | null;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  discount_amount_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  final_cost_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  final_cost_thb!: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
  selling_price_foreign!: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
  selling_exchange_rate!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  selling_total_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  profit_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  profit_thb!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
