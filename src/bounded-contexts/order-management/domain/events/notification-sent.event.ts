import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class NotificationSentEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly recipientId: string,
    public readonly channel: string,
    occurredAt?: Date,
  ) {
    super(aggregateId, 'NotificationSent', occurredAt);
  }
}
