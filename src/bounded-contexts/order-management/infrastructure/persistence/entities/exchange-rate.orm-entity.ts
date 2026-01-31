import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity('exchange_rates', { engine: 'InnoDB' })
@Index(['merchant_id', 'rate_date', 'rate_type', 'base_currency'], { unique: true })
export class ExchangeRateOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  rate_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'varchar', length: 10 })
  base_currency!: string;

  @Column({ type: 'varchar', length: 10 })
  target_currency!: string;

  @Column({ type: 'enum', enum: ['BUY', 'SELL'] })
  rate_type!: 'BUY' | 'SELL';

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  rate!: number;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'date' })
  rate_date!: Date;

  @Column({ type: 'char', length: 36 })
  created_by!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
