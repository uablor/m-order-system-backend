import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('arrival_items', { engine: 'InnoDB' })
export class ArrivalItemOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  technical_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_arrival_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_order_item_id!: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  arrived_quantity!: number;

  @Column({ type: 'varchar', length: 50 })
  condition!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
