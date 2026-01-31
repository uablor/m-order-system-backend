import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('arrivals', { engine: 'InnoDB' })
export class ArrivalOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  technical_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_order_id!: string;

  @Column({ type: 'char', length: 36 })
  technical_merchant_id!: string;

  @Column({ type: 'date' })
  arrived_date!: Date;

  @Column({ type: 'time', nullable: true })
  arrived_time!: string | null;

  @Column({ type: 'char', length: 36 })
  technical_user_id!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
