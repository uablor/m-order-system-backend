import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('payments', { engine: 'InnoDB' })
export class PaymentOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  payment_id!: string;

  @Column({ type: 'char', length: 36 })
  order_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'char', length: 36 })
  customer_id!: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  payment_amount!: number;

  @Column({ type: 'date' })
  payment_date!: Date;

  @Column({ type: 'varchar', length: 50 })
  payment_method!: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  payment_proof_url!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  payment_at!: Date | null;

  @Column({ type: 'text', nullable: true })
  customer_message!: string | null;

  @Column({ type: 'varchar', length: 20 })
  status!: string;

  @Column({ type: 'char', length: 36, nullable: true })
  verified_by!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  verified_at!: Date | null;

  @Column({ type: 'char', length: 36, nullable: true })
  rejected_by!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  rejected_at!: Date | null;

  @Column({ type: 'text', nullable: true })
  reject_reason!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
