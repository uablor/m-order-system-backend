import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerOrderOrmEntity } from './customer-order.orm-entity';

@Entity('customer_order_items', { engine: 'InnoDB' })
export class CustomerOrderItemOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column({ type: 'char', length: 36 })
  customer_order_id!: string;

  @ManyToOne(() => CustomerOrderOrmEntity, (co) => co.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_order_id' })
  customer_order!: CustomerOrderOrmEntity;

  @Column({ type: 'char', length: 36 })
  order_item_id!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  selling_price_foreign!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  selling_total_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  profit_lak!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
