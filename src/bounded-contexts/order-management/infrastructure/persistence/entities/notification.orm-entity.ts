import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications', { engine: 'InnoDB' })
export class NotificationOrmEntity {
  @PrimaryColumn('char', { length: 36 })
  notification_id!: string;

  @Column({ type: 'char', length: 36, unique: true })
  domain_id!: string;

  @Column({ type: 'char', length: 36 })
  merchant_id!: string;

  @Column({ type: 'char', length: 36 })
  customer_id!: string;

  @Column({ type: 'varchar', length: 32 })
  notification_type!: string; // ARRIVAL | PAYMENT | REMINDER

  @Column({ type: 'varchar', length: 16 })
  channel!: string; // FB | LINE | WHATSAPP

  @Column({ type: 'varchar', length: 255 })
  recipient_contact!: string;

  @Column({ type: 'text' })
  message_content!: string;

  @Column({ type: 'text', nullable: true })
  notification_link!: string | null;

  @Column({ type: 'int', default: 0 })
  retry_count!: number;

  @Column({ type: 'timestamp', nullable: true })
  last_retry_at!: Date | null;

  @Column({ type: 'varchar', length: 16 })
  status!: string; // SENT | FAILED

  @Column({ type: 'timestamp', nullable: true })
  sent_at!: Date | null;

  @Column({ type: 'text', nullable: true })
  error_message!: string | null;

  @Column({ type: 'json', nullable: true })
  related_orders!: string[] | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
