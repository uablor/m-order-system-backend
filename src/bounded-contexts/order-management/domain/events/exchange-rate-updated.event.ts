import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class ExchangeRateUpdatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly merchantId: string,
    public readonly rate: number,
    occurredAt?: Date,
  ) {
    super(aggregateId, 'ExchangeRateUpdated', occurredAt);
  }
}
