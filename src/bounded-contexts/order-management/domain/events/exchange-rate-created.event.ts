import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class ExchangeRateCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly merchantId: string,
    public readonly baseCurrency: string,
    public readonly rateType: string,
    occurredAt?: Date,
  ) {
    super(aggregateId, 'ExchangeRateCreated', occurredAt);
  }
}
