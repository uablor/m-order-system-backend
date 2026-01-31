import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class PaymentReceivedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly amount: number,
    public readonly orderId: string,
    occurredAt?: Date,
  ) {
    super(aggregateId, 'PaymentReceived', occurredAt);
  }
}
