import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('arrivals', { engine: 'InnoDB' })
export class ArrivalOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  arrival_id!: string;

  @Column({ type: 'char', length: 36 })
  order_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'date' })
  arrived_date!: Date;

  @Column({ type: 'time', nullable: true })
  arrived_time!: string | null;

  @Column({ type: 'char', length: 36 })
  recorded_by!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
