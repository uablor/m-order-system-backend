import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ArrivalOrmEntity } from './arrival.orm-entity';

@Entity('arrival_items', { engine: 'InnoDB' })
export class ArrivalItemOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  arrival_item_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  arrival_id!: string;

  @ManyToOne(() => ArrivalOrmEntity, (a) => a.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'arrival_id' })
  arrival!: ArrivalOrmEntity;

  @Column({ type: 'char', length: 36 })
  order_item_id!: string;

  @Column({ type: 'int' })
  arrived_quantity!: number;

  @Column({ type: 'varchar', length: 16, default: 'OK' })
  condition!: string; // OK | DAMAGED | LOST

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
