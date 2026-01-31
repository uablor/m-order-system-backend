import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { NotificationSentEvent } from '../events/notification-sent.event';

export interface NotificationAggregateProps extends EntityProps {
  merchantId: string;
  recipientId: string;
  type: string;
  channel: string;
  subject: string;
  body: string;
  sentAt: Date;
}

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
    const agg = new NotificationAggregate({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
    agg.addDomainEvent(
      new NotificationSentEvent(agg.id, props.recipientId, props.channel, props.sentAt),
    );
    return agg;
  }

  static fromPersistence(props: NotificationAggregateProps): NotificationAggregate {
    return new NotificationAggregate(props);
  }

  get merchantId(): string {
    return this.props.merchantId;
  }
  get recipientId(): string {
    return this.props.recipientId;
  }
  get type(): string {
    return this.props.type;
  }
  get channel(): string {
    return this.props.channel;
  }
  get subject(): string {
    return this.props.subject;
  }
  get body(): string {
    return this.props.body;
  }
  get sentAt(): Date {
    return this.props.sentAt;
  }
}
