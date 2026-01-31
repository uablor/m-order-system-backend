import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class ArrivalRecordedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly arrivalDate: Date,
    occurredAt?: Date,
  ) {
    super(aggregateId, 'ArrivalRecorded', occurredAt);
  }
}
