import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArrivalItemOrmEntity } from './arrival-item.orm-entity';

@Entity('arrivals', { engine: 'InnoDB' })
export class ArrivalOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  arrival_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

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

  @Column({ type: 'varchar', length: 32, default: 'PENDING' })
  status!: string; // PENDING | CONFIRMED

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => ArrivalItemOrmEntity, (item) => item.arrival)
  items!: ArrivalItemOrmEntity[];
}
