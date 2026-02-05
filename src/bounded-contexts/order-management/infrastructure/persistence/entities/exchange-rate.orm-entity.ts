import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('exchange_rates', { engine: 'InnoDB' })
@Index(['merchant_id', 'rate_date', 'base_currency', 'target_currency', 'rate_type'], {
  unique: true,
})
export class ExchangeRateOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  rate_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'varchar', length: 8 })
  base_currency!: string;

  @Column({ type: 'varchar', length: 8 })
  target_currency!: string;

  @Column({ type: 'varchar', length: 8 })
  rate_type!: string; // BUY | SELL

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  rate!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'date' })
  rate_date!: Date;

  @Column({ type: 'char', length: 36 })
  created_by!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
