export interface DomainEvent {
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly eventType: string;
}

export abstract class BaseDomainEvent implements DomainEvent {
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly eventType: string;

  constructor(aggregateId: string, eventType: string, occurredAt?: Date) {
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.occurredAt = occurredAt ?? new Date();
  }
}
