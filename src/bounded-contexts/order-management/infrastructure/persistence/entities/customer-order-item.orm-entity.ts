import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('customer_order_items', { engine: 'InnoDB' })
export class CustomerOrderItemOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  technical_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_customer_order_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_order_item_id!: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
  selling_price_foreign!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  selling_total_lak!: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  profit_lak!: number;
}
