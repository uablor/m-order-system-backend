import { EntityProps } from './entity-base';
import { UniqueEntityId } from './value-objects';

export abstract class AggregateRoot<T extends EntityProps> {
  protected readonly props: T;
  private _domainEvents: unknown[] = [];

  protected constructor(props: T) {
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this.props.id;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get domainEvents(): unknown[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: unknown): void {
    this._domainEvents.push(event);
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  equals(entity?: AggregateRoot<T>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this.id.equals(entity.id);
  }
}
