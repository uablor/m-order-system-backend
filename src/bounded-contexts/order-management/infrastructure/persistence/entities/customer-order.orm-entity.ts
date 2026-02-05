import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';

@Entity('customer_orders', { engine: 'InnoDB' })
export class CustomerOrderOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  customer_order_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  order_id!: string;

  @Column({ type: 'char', length: 36 })
  customer_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_selling_amount_lak!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  total_paid!: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  remaining_amount!: string;

  @Column({ type: 'varchar', length: 32 })
  payment_status!: string; // UNPAID | PARTIAL | PAID

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => CustomerOrderItemOrmEntity, (item) => item.customer_order)
  items!: CustomerOrderItemOrmEntity[];
}
