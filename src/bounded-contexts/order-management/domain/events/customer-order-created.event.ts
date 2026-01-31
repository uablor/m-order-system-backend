import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class CustomerOrderCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly customerId: string,
    public readonly merchantId: string,
    public readonly orderCode: string,
    occurredAt?: Date,
  ) {
    super(aggregateId, 'CustomerOrderCreated', occurredAt);
  }
}
