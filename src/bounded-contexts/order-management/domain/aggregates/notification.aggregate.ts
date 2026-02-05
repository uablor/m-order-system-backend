import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { NotificationType } from '../value-objects/notification-type.vo';
import type { NotificationChannel } from '../value-objects/notification-channel.vo';
import type { NotificationStatus } from '../value-objects/notification-status.vo';

export interface NotificationAggregateProps extends EntityProps {
  merchantId: string;
  customerId: string;
  notificationType: NotificationType;
  channel: NotificationChannel;
  recipientContact: string;
  messageContent: string;
  notificationLink?: string;
  retryCount: number;
  lastRetryAt?: Date;
  status: NotificationStatus;
  sentAt?: Date;
  errorMessage?: string;
  relatedOrders?: string[]; // order ids
}

const MAX_RETRY = 5;

export class NotificationAggregate extends AggregateRoot<NotificationAggregateProps> {
  private constructor(props: NotificationAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<NotificationAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): NotificationAggregate {
    if (!props.merchantId?.trim()) throw new Error('Merchant is required');
    if (!props.recipientContact?.trim()) throw new Error('Recipient contact is required');
    const validTypes: NotificationType[] = ['ARRIVAL', 'PAYMENT', 'REMINDER'];
    if (!validTypes.includes(props.notificationType))
      throw new Error('Invalid notification type');
    const validChannels: NotificationChannel[] = ['FB', 'LINE', 'WHATSAPP'];
    if (!validChannels.includes(props.channel)) throw new Error('Invalid channel');
    return new NotificationAggregate({
      ...props,
      retryCount: props.retryCount ?? 0,
      status: props.status ?? 'FAILED',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: NotificationAggregateProps): NotificationAggregate {
    return new NotificationAggregate(props);
  }

  get merchantId(): string {
    return this.props.merchantId;
  }
  get customerId(): string {
    return this.props.customerId;
  }
  get notificationType(): NotificationType {
    return this.props.notificationType;
  }
  get channel(): NotificationChannel {
    return this.props.channel;
  }
  get recipientContact(): string {
    return this.props.recipientContact;
  }
  get messageContent(): string {
    return this.props.messageContent;
  }
  get notificationLink(): string | undefined {
    return this.props.notificationLink;
  }
  get retryCount(): number {
    return this.props.retryCount;
  }
  get lastRetryAt(): Date | undefined {
    return this.props.lastRetryAt;
  }
  get status(): NotificationStatus {
    return this.props.status;
  }
  get sentAt(): Date | undefined {
    return this.props.sentAt;
  }
  get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }
  get relatedOrders(): string[] | undefined {
    return this.props.relatedOrders;
  }

  markSent(): void {
    (this.props as NotificationAggregateProps).status = 'SENT';
    (this.props as NotificationAggregateProps).sentAt = new Date();
    (this.props as NotificationAggregateProps).updatedAt = new Date();
  }

  markFailed(errorMessage?: string): void {
    (this.props as NotificationAggregateProps).status = 'FAILED';
    (this.props as NotificationAggregateProps).errorMessage = errorMessage;
    (this.props as NotificationAggregateProps).updatedAt = new Date();
  }

  retry(): void {
    if (this.props.retryCount >= MAX_RETRY)
      throw new Error(`Max retry limit (${MAX_RETRY}) reached`);
    (this.props as NotificationAggregateProps).retryCount = this.props.retryCount + 1;
    (this.props as NotificationAggregateProps).lastRetryAt = new Date();
    (this.props as NotificationAggregateProps).updatedAt = new Date();
  }
}
